const SHEET_ID = '1qk9eLhwKgPvh2fLwWNSthV4JKyDkJGqJojhLDus5460';
// โฟลเดอร์ Drive สำหรับเก็บไฟล์หลักฐานการนิเทศ (opec-uploads)
const DRIVE_FOLDER_ID = '1R__WEisrqbmLu3OKsRbih_yqBX_s_09O';
// ============================================================
// ระบบนิเทศออนไลน์ สถานศึกษาเอกชนในระบบ จ.นราธิวาส
// ใช้ชีต ADDR_SCHOOL + DATA_SCHOOL + USERS (USERS ร่วมกับระบบอื่น ภายใน Spreadsheet เดียวกัน)
// อ้างอิง: แผนนิเทศ ติดตาม และตรวจเยี่ยมชั้นเรียนโรงเรียนเอกชนในระบบ จ.นราธิวาส
// โครงสร้างชีต ADDR_SCHOOL (เริ่มข้อมูลจริงที่แถว 6):
//   A=รหัส, B=ชื่อโรงเรียน, C=ที่อยู่, D=อำเภอ, E=ตำบล, F=โทรศัพท์,
//   G=รูปแบบการจัดการศึกษา (แบบสอนสามัญ / แบบสอนสามัญควบคู่ศาสนาอิสลาม),
//   H=ผู้บริหาร, I=จำนวนครู, J=จำนวนนักเรียน, K=พิกัดแผนที่
// คะแนนตามคู่มือ ระดับ 2/1/0/N-A:
//   ส่วนที่ 1 ประเด็นกลาง (ทุกโรงเรียน): ข้อ 1-22 (5 ด้าน) รวมสูงสุด 44
//   ส่วนที่ 2 เพิ่มเติมสำหรับสามัญควบคู่ศาสนา: ข้อ 23-30 (2 ด้าน) สูงสุด 16
//   ส่วนที่ 3 ตรวจเยี่ยมชั้นเรียนฉบับสั้น: 8 ข้อ สูงสุด 16
//   ส่วนที่ 4 สุ่มตรวจผลการเรียนรู้: 4 ข้อ สูงสุด 8
//   ร้อยละ = รวมส่วนที่ 1 / 44 x 100 ; ระดับ: >=80 ดีมาก, 60-79 ดี, 40-59 พอใช้, <40 ต้องปรับปรุง
// ============================================================
const SHEET_DATA_SCHOOL = 'DATA_SCHOOL';
const SHEET_ADDR_SCHOOL = 'ADDR_SCHOOL';
const SHEET_USERS = 'USERS';
const SCHOOL_ADDR_COLS = 11;

// DATA_SCHOOL (15 คอลัมน์): Timestamp, ID, ชื่อโรงเรียน, รูปแบบ, ส1(0-44), ส2(0-16), ตรวจเยี่ยม(0-16), สุ่มตรวจ(0-8), รวมส1, ร้อยละ, ระดับ, รายละเอียด, ผู้นิเทศ, แก้ไขครั้งล่าสุด, ผู้แก้ไขล่าสุด
const DATA_HEADERS = ['Timestamp', 'ID', 'ชื่อโรงเรียน', 'รูปแบบ', 'ส่วนที่1/44', 'ส่วนที่2/16', 'ตรวจเยี่ยม/16', 'สุ่มตรวจ/8', 'รวมส1', 'ร้อยละ', 'ระดับ', 'รายละเอียด', 'ผู้นิเทศ', 'แก้ไขครั้งล่าสุด', 'ผู้แก้ไขล่าสุด'];

function getPing() { return 'pong ' + new Date().toISOString(); }

function doGet() {
  return HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>ระบบนิเทศออนไลน์ สถานศึกษาเอกชนในระบบ จังหวัดนราธิวาส</title>' +
    '<style>body{font-family:"Sarabun",sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#ecfdf5;color:#065f46}.box{text-align:center;background:#fff;padding:48px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.08)}a{display:inline-block;margin-top:16px;padding:12px 24px;background:#065f46;color:#fff;text-decoration:none;border-radius:10px}</style>' +
    '</head><body><div class="box">' +
    '<h1>🏫 ระบบนิเทศออนไลน์ สถานศึกษาเอกชนในระบบ จ.นราธิวาส</h1>' +
    '<p>บริการนี้เป็น API ของระบบนิเทศออนไลน์โรงเรียนเอกชนในระบบ</p>' +
    '<p style="color:#64748b;font-size:14px">หน้าเว็บหลักถูกเปิดใช้งานผ่านหน้าจอระบบแยกต่างหาก</p>' +
    '</div></body></html>'
  );
}

function doPost(e) {
  try {
    const req = JSON.parse(e.postData.contents);
    const action = req.action;
    const payload = req.payload;
    let res = {};

    if (action === 'login') {
      res = loginUser(payload);
    } else if (action === 'register') {
      res = registerUser(payload);
    } else if (action === 'getUsers') {
      res = getUsers(payload);
    } else if (action === 'setUserStatus') {
      res = setUserStatus(payload);
    } else if (action === 'getSchoolList') {
      res = getSchoolList();
    } else if (action === 'getSchoolListPublic') {
      res = getSchoolList();
    } else if (action === 'getStatsPublic') {
      res = getStatsSchool();
    } else if (action === 'getStatsSchool') {
      res = getStatsSchool();
    } else if (action === 'getSchoolData') {
      res = getSchoolData(payload);
    } else if (action === 'getSchoolEvaluations') {
      res = getSchoolEvaluations(payload);
    } else if (action === 'saveSchoolEvaluation') {
      res = saveSchoolEvaluation(payload);
    } else if (action === 'saveSchoolPin') {
      res = saveSchoolPin(payload);
    } else if (action === 'deleteSchoolEvaluation') {
      res = deleteSchoolEvaluation(payload);
    } else if (action === 'chat') {
      res = processChatbot(payload);
    } else if (action === 'getUploads') {
      res = getUploads(payload);
    } else if (action === 'uploadFile') {
      res = uploadFile(payload);
    } else if (action === 'deleteUpload') {
      res = deleteUpload(payload);
    }

    return ContentService.createTextOutput(JSON.stringify(res))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

const USERS_HEADERS = ['Username','Password','ชื่อ-นามสกุล','เบอร์โทร','สถานะ','บทบาท'];

function ensureUsersSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_USERS);
  if(!sheet) {
    sheet = ss.insertSheet(SHEET_USERS);
    sheet.getRange(1, 1, 1, USERS_HEADERS.length).setValues([USERS_HEADERS]);
    sheet.appendRow(['admin','admin123','ผู้ดูแลระบบ','-','ใช้งาน','ผู้ดูแลระบบ']);
    return sheet;
  }
  const head = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];
  if(String(head[0]).trim() !== 'Username' || String(head[4] || '').trim() !== 'สถานะ') {
    sheet.getRange(1, 1, 1, USERS_HEADERS.length).setValues([USERS_HEADERS]);
  }
  const lastRow = sheet.getLastRow();
  let hasAdmin = false;
  if(lastRow >= 1) {
    const rows = sheet.getRange(1, 1, lastRow, 6).getValues();
    for(let i = 1; i < rows.length; i++) {
      const u = String(rows[i][0]).trim();
      if(u === '') continue;
      if(u.toLowerCase() === 'admin') hasAdmin = true;
      if(String(rows[i][4] || '').trim() === '') sheet.getRange(i + 1, 5).setValue('ใช้งาน');
      if(String(rows[i][5] || '').trim() === '') {
        sheet.getRange(i + 1, 6).setValue(u.toLowerCase() === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้');
      }
    }
  }
  if(!hasAdmin) sheet.appendRow(['admin','admin123','ผู้ดูแลระบบ','-','ใช้งาน','ผู้ดูแลระบบ']);
  return sheet;
}

function loginUser(data) {
  const sheet = ensureUsersSheet();
  const rows = sheet.getDataRange().getValues();
  const inputUser = String(data.username).trim();
  const inputPass = String(data.password).trim();

  for(let i = 1; i < rows.length; i++) {
    let sheetUser = String(rows[i][0]).trim();
    let sheetPass = String(rows[i][1]).trim();

    if(sheetUser === inputUser && sheetPass === inputPass) {
      const status = String(rows[i][4] || '').trim() || 'ใช้งาน';
      const role = String(rows[i][5] || '').trim() || (sheetUser.toLowerCase() === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้');
      if(status === 'รออนุมัติ') {
        return { success: false, message: 'บัญชีของคุณยังรอการอนุมัติจากผู้ดูแลระบบ กรุณารอผู้ดูแลระบบอนุมัติก่อนเข้าสู่ระบบ' };
      }
      if(status === 'ระงับ') {
        return { success: false, message: 'บัญชีของคุณถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ' };
      }
      return {
        success: true,
        userData: { username: sheetUser, fname: rows[i][2], tel: rows[i][3], role: role, status: status }
      };
    }
  }
  return { success: false, message: "Username หรือ Password ไม่ถูกต้อง" };
}

function registerUser(data) {
  const sheet = ensureUsersSheet();
  const rows = sheet.getDataRange().getValues();
  const u = String(data.username).trim();
  const p = String(data.password).trim();
  const f = String(data.fname).trim();
  const tel = String(data.tel || '').trim();

  if(!u || !p || !f) return {success: false, message: "กรอกข้อมูลไม่ครบถ้วน (ต้องมี Username, Password และชื่อ-นามสกุล)"};

  for(let i = 1; i < rows.length; i++) {
    if(String(rows[i][0]).trim().toLowerCase() === u.toLowerCase()) {
      return {success: false, message: "Username นี้ถูกใช้งานแล้ว กรุณาใช้ชื่ออื่น"};
    }
  }

  sheet.appendRow([u, p, f, tel, 'รออนุมัติ', 'ผู้ใช้']);
  return {success: true, message: "สมัครสมาชิกเรียบร้อย!<br>บัญชีของคุณ<b>รอการอนุมัติจากผู้ดูแลระบบ</b> จึงจะเข้าสู่ระบบได้"};
}

function getUsers(data) {
  const sheet = ensureUsersSheet();
  const rows = sheet.getDataRange().getValues();
  const admin = String(data.username || '').trim();
  let isAdmin = false;
  for(let i = 1; i < rows.length; i++) {
    if(String(rows[i][0]).trim() === admin && String(rows[i][5] || '').trim() === 'ผู้ดูแลระบบ') { isAdmin = true; break; }
  }
  if(!isAdmin) return {success: false, message: 'ไม่มีสิทธิ์ใช้งาน (เฉพาะผู้ดูแลระบบ)'};
  const list = [];
  for(let i = 1; i < rows.length; i++) {
    if(String(rows[i][0]).trim() === '') continue;
    list.push({
      row: i + 1,
      username: rows[i][0],
      fname: rows[i][2],
      tel: rows[i][3],
      status: String(rows[i][4] || '').trim() || 'ใช้งาน',
      role: String(rows[i][5] || '').trim() || 'ผู้ใช้'
    });
  }
  return {success: true, data: list};
}

function setUserStatus(data) {
  const sheet = ensureUsersSheet();
  const rows = sheet.getDataRange().getValues();
  const admin = String(data.admin || '').trim();
  const target = String(data.username || '').trim();
  const status = String(data.status || '').trim();

  let isAdmin = false, targetRow = -1;
  for(let i = 1; i < rows.length; i++) {
    const u = String(rows[i][0]).trim();
    if(u === admin && String(rows[i][5] || '').trim() === 'ผู้ดูแลระบบ') isAdmin = true;
    if(u === target) targetRow = i + 1;
  }
  if(!isAdmin) return {success: false, message: 'ไม่มีสิทธิ์ใช้งาน (เฉพาะผู้ดูแลระบบ)'};
  if(targetRow < 1) return {success: false, message: 'ไม่พบบัญชีผู้ใช้นี้'};
  if(status === 'ใช้งาน' || status === 'ระงับ') {
    sheet.getRange(targetRow, 5).setValue(status);
    return {success: true, message: (status === 'ใช้งาน' ? '✅ เปิดใช้งาน' : '⛔ ระงับ') + 'บัญชี "' + target + '" เรียบร้อย'};
  }
  return {success: false, message: 'สถานะไม่ถูกต้อง'};
}

// --- เตรียมชีต DATA_SCHOOL + ADDR_SCHOOL (สร้างถ้ายังไม่มี + จัดเรียง Header) ---
function ensureSheets() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let data = ss.getSheetByName(SHEET_DATA_SCHOOL);
  if(!data) {
    data = ss.insertSheet(SHEET_DATA_SCHOOL);
    data.getRange(1, 1, 1, DATA_HEADERS.length).setValues([DATA_HEADERS]);
  } else {
    data.getRange(1, 1, 1, DATA_HEADERS.length).setValues([DATA_HEADERS]);
  }

  const ADDR_HEADERS = ['รหัส','ชื่อโรงเรียน','ที่อยู่','อำเภอ','ตำบล','โทรศัพท์','รูปแบบ','ผู้บริหาร','จำนวนครู','จำนวนนักเรียน','พิกัดแผนที่'];
  const addr = ss.getSheetByName(SHEET_ADDR_SCHOOL);
  if(!addr) {
    const ns = ss.insertSheet(SHEET_ADDR_SCHOOL);
    ns.getRange(1, 1, 1, ADDR_HEADERS.length).setValues([ADDR_HEADERS]);
    ns.getRange(2, 1, 1, ADDR_HEADERS.length).setValues([[ADDR_HEADERS[0],'',ADDR_HEADERS[2],ADDR_HEADERS[3],ADDR_HEADERS[4],ADDR_HEADERS[5],ADDR_HEADERS[6],ADDR_HEADERS[7],ADDR_HEADERS[8],ADDR_HEADERS[9],ADDR_HEADERS[10]]]);
  } else if(addr.getLastRow() < 6) {
    addr.getRange(1, 1, 1, ADDR_HEADERS.length).setValues([ADDR_HEADERS]);
  }
  return ss;
}

function formatDate(d) {
  if(!d) return '';
  if(!(d instanceof Date)) d = new Date(d);
  const pad = n => ('0' + n).slice(-2);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
         pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}

// --- ดึงประวัติการนิเทศของโรงเรียนที่เลือก (จาก DATA_SCHOOL) ---
function getSchoolEvaluations(id) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  id = String(id).trim();
  const list = [];

  const sheet = ss.getSheetByName(SHEET_DATA_SCHOOL);
  if(sheet) {
    const lastRow = sheet.getLastRow();
    if(lastRow >= 2) {
      const rows = sheet.getRange(2, 1, lastRow - 1, DATA_HEADERS.length).getValues();
      for(let i = 0; i < rows.length; i++) {
        if(String(rows[i][1]).trim() === id) {
          let details = null;
          try { details = JSON.parse(rows[i][11] || 'null'); } catch(e) { details = null; }
          list.push({
            row: i + 2,
            timestamp: formatDate(rows[i][0]),
            id: rows[i][1],
            name: rows[i][2],
            form: String(rows[i][3] || ''),
            s1: rows[i][4],
            s2: rows[i][5],
            s3: rows[i][6],
            s4: rows[i][7],
            totalScore: rows[i][8],
            pct: rows[i][9],
            level: rows[i][10],
            details: details,
            supervisor: rows[i][12],
            lastEdit: formatDate(rows[i][13]),
            lastEditor: rows[i][14]
          });
        }
      }
    }
  }
  list.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
  return {success: true, data: list};
}

// --- รายชื่อสถานศึกษา (ADDR_SCHOOL แถว 6 เป็นต้นไป) ---
function getSchoolList() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_ADDR_SCHOOL);
  if(!sheet) return {success: true, data: []};
  const lastRow = sheet.getLastRow();
  if(lastRow < 6) return {success: true, data: []};
  const rows = sheet.getRange(6, 1, lastRow - 5, SCHOOL_ADDR_COLS).getValues();
  const list = [];
  for(let i = 0; i < rows.length; i++) {
    if(String(rows[i][0]).trim() === '') continue;
    list.push({
      id: String(rows[i][0]).trim(),
      name: String(rows[i][1] || ''),
      address: String(rows[i][2] || ''),
      dist: String(rows[i][3] || ''),
      subdist: String(rows[i][4] || ''),
      phone: String(rows[i][5] || ''),
      form: String(rows[i][6] || ''),
      admin: String(rows[i][7] || ''),
      staff: String(rows[i][8] || ''),
      students: String(rows[i][9] || ''),
      coords: String(rows[i][10] || '')
    });
  }
  return {success: true, data: list};
}

// --- ข้อมูลรายละเอียดของโรงเรียนที่เลือก ---
function getSchoolData(id) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  id = String(typeof id === 'object' && id !== null ? (id.id || '') : id).trim();
  const sheet = ss.getSheetByName(SHEET_ADDR_SCHOOL);
  if(sheet) {
    const lastRow = sheet.getLastRow();
    if(lastRow >= 6) {
      const rows = sheet.getRange(6, 1, lastRow - 5, SCHOOL_ADDR_COLS).getValues();
      for(let i = 0; i < rows.length; i++) {
        if(String(rows[i][0]).trim() === id) {
          return {
            success: true,
            data: {
              row: i + 6,
              id: rows[i][0], name: rows[i][1], address: rows[i][2],
              dist: rows[i][3], subdist: rows[i][4], phone: rows[i][5],
              form: String(rows[i][6] || ''),
              admin: rows[i][7], staff: rows[i][8], students: rows[i][9],
              coords: String(rows[i][10] || '')
            }
          };
        }
      }
    }
  }
  return {success: false, message: "ไม่พบข้อมูลโรงเรียน"};
}

// --- บันทึกพิกัดแผนที่ลงคอลัมน์ K ของ ADDR_SCHOOL (ไม่แตะคอลัมน์อื่น) ---
function saveSchoolPin(payload) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const p = (typeof payload === 'object' && payload !== null) ? payload : {};
  const id = String(p.id || '').trim();
  const coords = String(p.coords || '').trim();
  if (!id) return {success: false, message: 'ไม่พบรหัสโรงเรียน'};
  if (!coords) return {success: false, message: 'ไม่พบพิกัดแผนที่'};
  const sheet = ss.getSheetByName(SHEET_ADDR_SCHOOL);
  if (!sheet) return {success: false, message: 'ไม่พบชีต ADDR_SCHOOL'};
  const lastRow = sheet.getLastRow();
  if (lastRow < 6) return {success: false, message: 'ไม่มีข้อมูลโรงเรียน'};
  const ids = sheet.getRange(6, 1, lastRow - 5, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim() === id) {
      sheet.getRange(6 + i, 11).setValue(coords);
      return {success: true, message: 'บันทึกพิกัดแผนที่เรียบร้อย'};
    }
  }
  return {success: false, message: 'ไม่พบรหัสโรงเรียนในข้อมูล'};
}

// --- บันทึก/แก้ไขผลการนิเทศ + อัปเดตข้อมูลโรงเรียน ---
// อัปเดต ADDR_SCHOOL เฉพาะคอลัมน์ B-J (col 2-10) — พิกัด (col 11) ไม่แตะ
function saveSchoolEvaluation(payload) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const t = payload.schoolData || {};
  const e = payload.evalData || {};

  const addrSheet = ss.getSheetByName(SHEET_ADDR_SCHOOL);
  if(addrSheet && t.row) {
    addrSheet.getRange(t.row, 2, 1, 9).setValues([[
      t.name, t.address, t.dist, t.subdist, t.phone, t.form, t.admin, t.staff, t.students
    ]]);
  }

  ensureSheets();
  const dataSheet = ss.getSheetByName(SHEET_DATA_SCHOOL);
  const supervisor = String(payload.supervisor || '');
  const now = new Date();
  const detailsJSON = JSON.stringify({
    formType: e.formType || '',
    round: e.round || '',
    answers: e.answers || {},
    notes: e.notes || {},
    multiVals: e.multiVals || {},
    basic: e.basic || {},
    strengths: e.strengths || [],
    develop: e.develop || [],
    support: e.support || [],
    agreements: e.agreements || [],
    followUp: e.followUp || {},
    fiveQ: e.fiveQ || {},
    sigAdmin: e.sigAdmin || '',
    sigLead: e.sigLead || '',
    sigRecord: e.sigRecord || '',
    evalDate: e.evalDate || '',
    comment: e.comment || ''
  });

  if(payload.editRow && !isNaN(payload.editRow)) {
    const row = Number(payload.editRow);
    dataSheet.getRange(row, 4).setValue(e.formType);
    dataSheet.getRange(row, 5).setValue(e.s1 !== undefined ? e.s1 : '');
    dataSheet.getRange(row, 6).setValue(e.s2 !== undefined ? e.s2 : '');
    dataSheet.getRange(row, 7).setValue(e.s3 !== undefined ? e.s3 : '');
    dataSheet.getRange(row, 8).setValue(e.s4 !== undefined ? e.s4 : '');
    dataSheet.getRange(row, 9).setValue(e.totalScore !== undefined ? e.totalScore : '');
    dataSheet.getRange(row, 10).setValue(e.pct !== undefined && e.pct !== null ? e.pct : '');
    dataSheet.getRange(row, 11).setValue(e.level);
    dataSheet.getRange(row, 12).setValue(detailsJSON);
    dataSheet.getRange(row, 14).setValue(now);
    dataSheet.getRange(row, 15).setValue(supervisor);
    return {
      success: true,
      message: 'แก้ไขผลการนิเทศเรียบร้อยแล้ว!<br>แก้ไขครั้งล่าสุด: ' + formatDate(now) + ' โดย ' + supervisor,
      lastEdit: formatDate(now),
      lastEditor: supervisor
    };
  }

  dataSheet.appendRow([now, t.id, t.name, e.formType,
    e.s1 !== undefined ? e.s1 : '', e.s2 !== undefined ? e.s2 : '',
    e.s3 !== undefined ? e.s3 : '', e.s4 !== undefined ? e.s4 : '',
    e.totalScore !== undefined ? e.totalScore : '',
    e.pct !== undefined && e.pct !== null ? e.pct : '', e.level,
    detailsJSON, supervisor, now, supervisor]);
  return {success: true, message: 'อัปเดตข้อมูลโรงเรียน และบันทึกผลการนิเทศเรียบร้อยแล้ว!', lastEdit: formatDate(now), lastEditor: supervisor};
}

// --- ผู้ดูแลระบบ: ลบบันทึกผลนิเทศ (แถวใน DATA_SCHOOL) ---
function deleteSchoolEvaluation(payload) {
  const p = (typeof payload === 'object' && payload !== null) ? payload : {};
  const admin = String(p.admin || '').trim();
  const row = Number(p.row);
  if(!admin || !row) return {success: false, message: 'ข้อมูลไม่ครบถ้วน'};
  const sheet = ensureUsersSheet();
  const rows = sheet.getDataRange().getValues();
  let isAdmin = false;
  for(let i = 1; i < rows.length; i++) {
    if(String(rows[i][0]).trim() === admin && String(rows[i][5] || '').trim() === 'ผู้ดูแลระบบ') { isAdmin = true; break; }
  }
  if(!isAdmin) return {success: false, message: 'ไม่มีสิทธิ์ใช้งาน (เฉพาะผู้ดูแลระบบ)'};
  const ds = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_DATA_SCHOOL);
  if(!ds) return {success: false, message: 'ไม่พบชีต DATA_SCHOOL'};
  if(row < 2 || row > ds.getLastRow()) return {success: false, message: 'ไม่พบแถวข้อมูล'};
  ds.deleteRow(row);
  return {success: true, message: 'ลบผลการนิเทศเรียบร้อยแล้ว'};
}

// --- สถิติระบบนิเทศโรงเรียนเอกชน (ADDR_SCHOOL + DATA_SCHOOL + USERS) ---
function getStatsSchool() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let totalSchools = 0, totalEval = 0, sumPct = 0, sumPctN = 0;
  let staff = 0, students = 0;
  const typeCount = { 'แบบสอนสามัญ': 0, 'แบบสอนสามัญควบคู่ศาสนาอิสลาม': 0 };
  const levelCounts = { 'ดีมาก': 0, 'ดี': 0, 'พอใช้': 0, 'ต้องปรับปรุง': 0 };
  const latest = [];

  const addr = ss.getSheetByName(SHEET_ADDR_SCHOOL);
  if(addr) {
    const lastRow = addr.getLastRow();
    if(lastRow >= 6) {
      const vals = addr.getRange(6, 1, lastRow - 5, SCHOOL_ADDR_COLS).getValues();
      for(let i = 0; i < vals.length; i++) {
        if(String(vals[i][0]).trim() === '') continue;
        totalSchools++;
        staff += Number(vals[i][8]) || 0;
        students += Number(vals[i][9]) || 0;
        const f = String(vals[i][6] || '').trim();
        if(typeCount[f] !== undefined) typeCount[f]++;
      }
    }
  }

  const data = ss.getSheetByName(SHEET_DATA_SCHOOL);
  if(data) {
    const lastRow = data.getLastRow();
    if(lastRow >= 2) {
      const vals = data.getRange(2, 1, lastRow - 1, DATA_HEADERS.length).getValues();
      for(let i = 0; i < vals.length; i++) {
        if(String(vals[i][0] || '') === '') continue;
        totalEval++;
        const pct = Number(vals[i][9]);
        if(!isNaN(pct) && vals[i][9] !== '') {
          sumPct += pct; sumPctN++;
          const lv = String(vals[i][10] || '').trim();
          if(levelCounts[lv] !== undefined) levelCounts[lv]++;
        }
        latest.push({
          timestamp: formatDate(vals[i][0]),
          id: vals[i][1], name: vals[i][2],
          form: vals[i][3], pct: vals[i][9], level: vals[i][10]
        });
      }
    }
  }

  let totalUsers = 0;
  const users = ss.getSheetByName(SHEET_USERS);
  if(users) {
    const lastRow = users.getLastRow();
    if(lastRow >= 2) {
      const vals = users.getRange(2, 1, lastRow, 6).getValues();
      for(let i = 0; i < vals.length; i++) {
        if(String(vals[i][0] || '').trim() !== '') totalUsers++;
      }
    }
  }

  return {
    success: true,
    data: {
      totalSchools: totalSchools,
      totalEval: totalEval,
      totalUsers: totalUsers,
      staff: staff,
      students: students,
      typeCount: typeCount,
      avgPct: sumPctN ? Math.round(sumPct / sumPctN) : 0,
      levelCounts: levelCounts,
      latest: latest.slice(0, 10)
    }
  };
}

// ============================================================
// ไฟล์หลักฐาน (อัปโหลดเก็บใน Drive โฟลเดอร์ opec-uploads — แยกโฟลเดอร์ย่อยตามรหัสโรงเรียน)
// ============================================================
function uploadFolder() {
  return DriveApp.getFolderById(DRIVE_FOLDER_ID);
}
function schoolFolder(schoolId) {
  const base = uploadFolder();
  const it = base.getFoldersByName(schoolId);
  return it.hasNext() ? it.next() : base.createFolder(schoolId);
}
function getUploads(payload) {
  const p = (typeof payload === 'object' && payload !== null) ? payload : {};
  const id = String(p.schoolId || '').trim();
  if (!id) return { success: false, message: 'ไม่พบรหัสโรงเรียน' };
  const list = [];
  const it = schoolFolder(id).getFiles();
  while (it.hasNext()) {
    const f = it.next();
    list.push({
      id: f.getId(),
      name: f.getName(),
      sizeKb: Math.max(1, Math.round(f.getSize() / 1024)),
      date: formatDate(f.getDateCreated()),
      mime: f.getMimeType(),
      urll: f.getUrl(),
      dl: f.getDownloadUrl()
    });
  }
  return { success: true, data: list.sort((a, b) => a.date < b.date ? 1 : -1) };
}
function uploadFile(payload) {
  const p = (typeof payload === 'object' && payload !== null) ? payload : {};
  const id = String(p.schoolId || '').trim();
  const filename = String(p.filename || '').trim();
  const data64 = String(p.data64 || '').replace(/\s+/g, '');
  if (!id) return { success: false, message: 'ไม่พบรหัสโรงเรียน' };
  if (!filename || !data64) return { success: false, message: 'ไม่พบข้อมูลไฟล์' };
  // ตรวจสอบว่าโรงเรียนมีในระบบ
  const inList = getSchoolList().data || [];
  let found = false;
  for (let i = 0; i < inList.length; i++) { if (inList[i].id === id) { found = true; break; } }
  if (!found) return { success: false, message: 'ไม่พบรหัสโรงเรียนในข้อมูล' };
  try {
    const maxBytes = 8 * 1024 * 1024; // จำกัด ~8MB
    const bytes = Utilities.base64Decode(data64);
    if (bytes.length > maxBytes) return { success: false, message: 'ไฟล์ใหญ่เกิน 8MB' };
    const blob = Utilities.newBlob(bytes, p.mime || 'application/octet-stream', filename);
    const file = schoolFolder(id).createFile(blob);
    return { success: true, message: 'อัปโหลด "' + filename + '" เรียบร้อยแล้ว', file: { id: file.getId(), name: file.getName() } };
  } catch (e) {
    return { success: false, message: 'อัปโหลดไม่สำเร็จ: ' + e.message };
  }
}
function deleteUpload(payload) {
  const p = (typeof payload === 'object' && payload !== null) ? payload : {};
  const fileId = String(p.id || '').trim();
  const username = String(p.username || '').trim();
  if (!fileId || !username) return { success: false, message: 'ข้อมูลไม่ครบถ้วน' };
  const users = ensureUsersSheet().getDataRange().getValues();
  let ok = false;
  for (let i = 1; i < users.length; i++) {
    if (String(users[i][0]).trim() === username && ["ผู้ใช้", "ผู้ดูแลระบบ"].indexOf(String(users[i][5] || '').trim()) >= 0) { ok = true; break; }
  }
  if (!ok) return { success: false, message: 'ไม่มีสิทธิ์ใช้งาน' };
  try {
    const f = DriveApp.getFileById(fileId);
    f.setTrashed(true);
    return { success: true, message: 'ลบไฟล์เรียบร้อยแล้ว' };
  } catch (e) {
    return { success: false, message: 'ไม่พบไฟล์: ' + e.message };
  }
}

// ============================================================
// ผู้ช่วย AI "นิเทศก์" — ใช้ Gemini API (key จาก Script Properties: geminiKey / GEMINI_API_KEY)
// ============================================================
function getGeminiApiKey() {
  const k = PropertiesService.getScriptProperties().getProperty('geminiKey') || PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  return k ? String(k).trim() : '';
}

function getSystemSettings() {
  const p = PropertiesService.getScriptProperties();
  const geminiKey = p.getProperty('geminiKey') || p.getProperty('GEMINI_API_KEY') || '';
  return {
    geminiKey: String(geminiKey).trim(),
    models: ['gemini-3.5-flash', 'gemini-3-flash', 'gemini-3.1-flash-lite', 'gemini-1.5-flash']
  };
}

function processChatbot(userMessage) {
  const msg = String(userMessage || '').toLowerCase();
  const settings = getSystemSettings();

  if (!settings.geminiKey || settings.geminiKey.trim() === '') {
    return { reply: offlineChatReply(msg) };
  }

  const contextData = fetchStatisticsForAISchool();
  return { reply: callGeminiAPI(userMessage, contextData, settings) };
}

function offlineChatReply(msg) {
  if (msg.includes('สวัสดี') || msg.includes('hello') || msg.includes('hi') || msg.includes('เป็นใคร') || msg.includes('อะไร') || msg.includes('ชื่ออะไร') || msg.length <= 10) {
    return 'สวัสดีครับ/ค่ะ ฉันคือ "นิเทศก์ AI" ผู้ช่วยระบบนิเทศออนไลน์สถานศึกษาเอกชนในระบบ จ.นราธิวาส<br>ยินดีให้คำแนะนำเกี่ยวกับเครื่องมือนิเทศ 6 ฉบับ ส่วนประเด็นการนิเทศ 9 ส่วน เกณฑ์การให้คะแนน (2/1/0/N-A) วงรอบการนิเทศ (ปีละ 2 ครั้ง) และวิธีสรุปผลได้เลยครับ';
  }
  if (msg.includes('เครื่องมือ') || msg.includes('ฉบับ') || msg.includes('ชุด')) {
    return 'เครื่องมือกลาง 6 ฉบับของจังหวัดครับ:<br>1) แบบข้อมูลพื้นฐานสถานศึกษา<br>2) แบบนิเทศการบริหารและระบบคุณภาพ<br>3) แบบนิเทศหลักสูตรและการจัดการเรียนรู้<br>4) แบบตรวจเยี่ยมหรือสังเกตการจัดการเรียนรู้ในชั้นเรียน<br>5) แบบสะท้อนผลและแผนพัฒนาเฉพาะประเด็น<br>6) แบบติดตามความก้าวหน้าและผลลัพธ์';
  }
  if (msg.includes('ส่วน') || msg.includes('ประเด็น') || msg.includes('ด้าน')) {
    return 'แบบนิเทศระดับพื้นที่ ประกอบด้วย 9 ส่วนครับ:<br>ส่วนที่ 1 ประเด็นกลางทุกโรงเรียน (5 ด้าน: บริหาร/หลักสูตร/จัดการเรียนรู้/วัดประเมินผล/ผลผู้เรียน — ข้อ 1-22)<br>ส่วนที่ 2 เพิ่มเติมสำหรับสามัญควบคู่ศาสนา (ด้าน 6-7, ข้อ 23-30)<br>ส่วนที่ 3 ตรวจเยี่ยมชั้นเรียนฉบับสั้น (8 ข้อ)<br>ส่วนที่ 4 สุ่มตรวจผลการเรียนรู้ผู้เรียน (4 ข้อ)<br>ส่วนที่ 5 สรุปผลรายโรงเรียน (จุดแข็ง/ประเด็นพัฒนา)<br>ส่วนที่ 6 ความต้องการการสนับสนุน<br>ส่วนที่ 7 ข้อตกลงเพื่อการพัฒนา<br>ส่วนที่ 8 การติดตามในภาคเรียนถัดไป<br>ส่วนที่ 9 สรุป 5 คำถามก่อนจบการนิเทศ';
  }
  if (msg.includes('เกณฑ์') || msg.includes('คะแนน')) {
    return 'เกณฑ์คะแนนตามคู่มือครับ:<br>2 = ทำได้ชัดเจน (มีหลักฐานผลการปฏิบัติ)<br>1 = กำลังพัฒนา (ทำแล้วบางส่วน)<br>0 = ต้องได้รับการช่วยเหลือ<br>N/A = ไม่เกี่ยวข้องหรือไม่มีข้อมูล<br>ส่วนที่ 1 (ข้อ 1-22) มีค่าสูงสุด 44 คะแนน คิดเป็นร้อยละ: ≥80 = ดีมาก, 60-79 = ดี, 40-59 = พอใช้, <40 = ต้องปรับปรุง';
  }
  if (msg.includes('รอบ') || msg.includes('ครั้ง') || msg.includes('ภาคเรียน')) {
    return 'วงรอบการนิเทศปีการศึกษาละ 2 ครั้งครับ:<br>• ครั้งที่ 1 (ภาคเรียนที่ 1): ศึกษาสภาพ กำหนดประเด็นพัฒนา 1-3 เรื่อง<br>• ช่วงระหว่างภาคเรียน: สนับสนุน/Coaching/PLC ตามความเหมาะสม<br>• ครั้งที่ 2 (ภาคเรียนที่ 2): ติดตามการเปลี่ยนแปลง สรุปผลการพัฒนา เริ่มจากข้อตกลงครั้งก่อน ไม่ต้องประเมินใหม่ทั้งหมด';
  }
  if (msg.includes('ตรวจเยี่ยม') || msg.includes('ชั้นเรียน') || msg.includes('สังเกต')) {
    return 'การตรวจเยี่ยมชั้นเรียนใช้เวลา 30-45 นาทีต่อชั้นครับ เน้น 6 ประเด็น: ผู้เรียนเข้าใจเป้าหมาย/มีส่วนร่วม/ได้คิด-ลงมือ-สื่อสาร/กิจกรรมสัมพันธ์กับบทเรียน/ครูตรวจสอบความเข้าใจและให้ข้อมูลย้อนกลับ/มีหลักฐานผู้เรียนเกิดการเรียนรู้ พร้อมบันทึก ชั้นเรียน รายวิชา เรื่อง จำนวนผู้เรียน และระยะเวลาที่สังเกต';
  }
  if (msg.includes('ข้อตกลง') || msg.includes('พัฒน')) {
    return 'ส่วนที่ 7 ข้อตกลงเพื่อการพัฒนา ประกอบด้วยตาราง: ประเด็นที่จะพัฒนา / สิ่งที่จะดำเนินการ / ผู้รับผิดชอบ / ผู้สนับสนุน / หลักฐานที่จะดูครั้งต่อไป / กำหนดติดตาม ครับ';
  }
  return 'สวัสดีครับ ฉัน "นิเทศก์ AI" พร้อมช่วยเรื่องเกณฑ์คะแนน ส่วนการนิเทศทั้ง 9 ส่วน เครื่องมือ 6 ฉบับ วงรอบการนิเทศ และการสรุปผล ได้เลยครับ';
}

function fetchStatisticsForAISchool() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_ADDR_SCHOOL);
  const stats = { count: 0, staff: 0, students: 0 };
  const lines = [];
  if (sheet) {
    const lastRow = sheet.getLastRow();
    if (lastRow >= 6) {
      const data = sheet.getRange(6, 1, lastRow - 5, SCHOOL_ADDR_COLS).getValues();
      for (let i = 0; i < data.length; i++) {
        if (String(data[i][0]).trim() === '') continue;
        stats.count++;
        stats.staff += Number(data[i][8]) || 0;
        stats.students += Number(data[i][9]) || 0;
        const f = String(data[i][6] || '').trim();
        lines.push("• " + (data[i][1] || '-') + " | ที่ตั้ง: " + [data[i][4], data[i][3]].filter(Boolean).join(' ') + " | โทร: " + (data[i][5] || '-') + " | " + (f || '-') + " | ครู " + (data[i][8] || 0) + " คน | นร. " + (data[i][9] || 0) + " คน");
      }
    }
  }
  return "[ข้อมูลจริงจากฐานข้อมูลระบบนิเทศออนไลน์สถานศึกษาเอกชนในระบบ — ใช้ตัวเลขเหล่านี้ตอบ ไม่ควรแต่งตัวเลข]\n\n" +
    "1. สถานศึกษาเอกชน: ทั้งหมด " + stats.count + " แห่ง\n" +
    "   - ครุรวม " + stats.staff + " คน\n" +
    "   - นักเรียนรวม " + stats.students + " คน\n\n" +
    "รายชื่อสถานศึกษา:\n" + lines.join('\n');
}

function callGeminiAPI(userMessage, contextData, settings) {
  const API_KEY = (settings && settings.geminiKey) ? settings.geminiKey : getGeminiApiKey();
  const MODELS = (settings && settings.models && settings.models.length) ? settings.models : ['gemini-3.5-flash', 'gemini-3-flash', 'gemini-3.1-flash-lite', 'gemini-1.5-flash'];

  const systemPrompt = 'คุณคือ "นิเทศก์ AI" ผู้ช่วยอัจฉริยะของระบบนิเทศออนไลน์สถานศึกษาเอกชนในระบบ จังหวัดนราธิวาส บุคลิกสุภาพ เป็นมิตร ให้เกียรติผู้ใช้ ใช้ภาษาไทยถูกต้อง สุภาพ นุ่มนวล ลงท้ายด้วย "ครับ/ค่ะ" ตอบกระชับตรงประเด็น ใช้ Bullet points อ่านง่าย\n\n' +
    "หน้าที่หลักของคุณ:\n" +
    "1. ให้ข้อมูลและให้คำแนะนำเกี่ยวกับการนิเทศ ติดตาม และตรวจเยี่ยมชั้นเรียนโรงเรียนเอกชนในระบบ ตามคู่มือจังหวัดนราธิวาส\n" +
    "2. ตอบคำถามส่วน/ด้านการนิเทศ: ส่วนที่ 1 ประเด็นกลาง (ด้านที่ 1 การบริหารและระบบคุณภาพ, ด้านที่ 2 การนำหลักสูตรไปใช้, ด้านที่ 3 การจัดการเรียนรู้, ด้านที่ 4 การวัดและประเมินผล, ด้านที่ 5 ผลที่เกิดขึ้นกับผู้เรียน) ข้อ 1-22 / ส่วนที่ 2 สำหรับสามัญควบคู่ศาสนาอิสลาม (ด้านที่ 6-7, ข้อ 23-30) / ส่วนที่ 3 ตรวจเยี่ยมชั้นเรียนฉบับสั้น / ส่วนที่ 4 สุ่มตรวจผลการเรียนรู้ / ส่วนที่ 5 สรุปผลรายโรงเรียน / ส่วนที่ 6 ความต้องการการสนับสนุน / ส่วนที่ 7 ข้อตกลงเพื่อการพัฒนา / ส่วนที่ 8 การติดตามในภาคเรียนถัดไป / ส่วนที่ 9 สรุป 5 คำถามก่อนจบ\n" +
    "3. เกณฑ์คะแนน 2/1/0/N-A และคำนวณร้อยละ: ร้อยละ 80 ขึ้นไป = ดีมาก, 60-79 = ดี, 40-59 = พอใช้, ต่ำกว่า 40 = ต้องปรับปรุง (ส่วนที่ 1 สูงสุด 44)\n" +
    "4. ข้อมูลสถานศึกษา: จากรายชื่อสถานศึกษาในฐานข้อมูล ตอบได้ทั้งภาพรวมและรายโรงเรียน (ตัวเลขจากฐานข้อมูล ห้ามแต่ง)\n" +
    "5. เมื่อผู้ใช้ทักทาย เริ่มด้วย 'สวัสดีครับ/ค่ะ ฉันคือนิเทศก์ AI' พร้อมแนะนำตัว\n\n" +
    "ข้อมูลจริงจากฐานข้อมูล:\n" + contextData;

  for (let m = 0; m < MODELS.length; m++) {
    try {
      const model = MODELS[m];
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + API_KEY;
      const response = UrlFetchApp.fetch(url, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: systemPrompt + "\n\nคำถามจากผู้ใช้: " + userMessage }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 1200 }
        }),
        muteHttpExceptions: true
      });
      const code = response.getResponseCode();
      if (code !== 200) continue;
      const data = JSON.parse(response.getContentText());
      const text = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts
        ? data.candidates[0].content.parts.map(p => p.text || '').join('') : '';
      if (text) return text;
    } catch (err) { continue; }
  }
  return offlineChatReply(String(userMessage || '').toLowerCase());
}