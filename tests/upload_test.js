// Run: node tests/upload_test.js — uses in-memory Drive doubles, no Google data.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

let created = 0, writes = 0, locks = 0, releases = 0, driveError = null;
const folders = new Map();
const iterator = values => {
  let index = 0;
  return { hasNext: () => index < values.length, next: () => values[index++] };
};
const base = {
  getFoldersByName: id => iterator(folders.has(id) ? [folders.get(id)] : []),
  createFolder(id) {
    if (driveError) throw driveError;
    created++;
    const files = [];
    const folder = {
      getFiles: () => iterator(files),
      createFile(blob) {
        writes++;
        const file = {
          getId: () => 'file-' + writes, getName: () => blob.name,
          getSize: () => blob.bytes.length, getDateCreated: () => new Date(),
          getMimeType: () => blob.mime, getUrl: () => 'https://example.test/file',
          getDownloadUrl: () => 'https://example.test/download'
        };
        files.push(file);
        return file;
      }
    };
    folders.set(id, folder);
    return folder;
  }
};
const context = vm.createContext({
  console,
  DriveApp: { getFolderById: () => base },
  LockService: { getScriptLock: () => ({ waitLock: () => locks++, releaseLock: () => releases++ }) },
  Utilities: {
    base64Decode: value => Buffer.from(value, 'base64'),
    newBlob: (bytes, mime, name) => ({ bytes, mime, name })
  }
});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../apps-script/รหัส.js'), 'utf8'), context);
context.getSchoolList = () => ({ success: true, data: [{ id: 'school-a' }, { id: 'school-b' }] });
context.formatDate = () => '2026-09-30';
const filePayload = (filename, mime = '', data64 = 'eA==') => ({ schoolId: 'school-a', filename, mime, data64 });

assert.equal(context.getUploads({ schoolId: 'school-a' }).data.length, 0);
assert.equal(created, 0, 'Listing an empty school must not create a folder');
assert.equal(locks, 0, 'Read-only listing must not acquire a write lock');

for (const [ext, mime] of Object.entries({
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', pdf: 'application/pdf',
  doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
})) {
  assert.equal(context.uploadFile(filePayload('sample.' + ext, mime)).success, true, ext);
}
assert.equal(created, 1, 'All files for one school share one folder');
assert.equal(context.getUploads({ schoolId: 'school-a' }).data.length, 8);
assert.equal(context.getUploads({ schoolId: 'school-b' }).data.length, 0);
assert.equal(created, 1, 'Listing another school must not create its folder');
assert.equal(context.uploadFile(filePayload('sample.PDF', 'application/octet-stream')).success, true);
assert.equal(context.uploadFile(filePayload('sample.exe')).success, false);
assert.equal(context.uploadFile(filePayload('sample.pdf', 'text/html')).success, false);
assert.equal(context.uploadFile({ ...filePayload('sample.pdf'), schoolId: 'unknown' }).success, false);

const sizeLimit = 8 * 1024 * 1024;
assert.equal(context.uploadFile(filePayload('limit.pdf', 'application/pdf', Buffer.alloc(sizeLimit).toString('base64'))).success, true);
assert.equal(context.uploadFile(filePayload('too-large.pdf', 'application/pdf', Buffer.alloc(sizeLimit + 1).toString('base64'))).success, false);
assert.equal(context.uploadFile(filePayload('much-too-large.pdf', 'application/pdf', 'A'.repeat(Math.ceil(sizeLimit / 3) * 4 + 4))).success, false);

driveError = new Error('You do not have permission to call DriveApp.Folder.createFolder. Required permissions: https://www.googleapis.com/auth/drive');
const denied = context.uploadFile({ ...filePayload('sample.pdf'), schoolId: 'school-b' });
assert.equal(denied.success, false);
assert.equal(denied.code, 'DRIVE_AUTH_REQUIRED');
assert.equal(locks, releases, 'Folder lock must be released even when Drive rejects access');
assert.equal(context.getUploads({ schoolId: 'school-b' }).success, true, 'Listing must remain read-only when write permission is absent');
console.log('PASS: upload types, 8 MiB boundary, school folders, read-only listing and Drive permission errors');
