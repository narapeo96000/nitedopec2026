// รายงานกลุ่มถัดไปจะไม่แสดงแท็บเติมจนกว่าผู้ใช้จะเลือกประเมินเป็น "1" หรือ "2"
function renderKeyvals(kvs, onChange) {
  if (!Array.isArray(kvs)) return "";
  return kvs.map(k => {
    const v = k.value;
    const dkk = k.dk ? ` data-key="${esc(k.dk)}"` : '';
    const hidden = (k.toHide)
      ? ` data-hide="${esc(JSON.stringify(k.toHide))}"`
      : '';
    return `<label class="keyval"${dkk}>
      <span class="kv-k">${esc(k.k)}</span>
      <input type="text" class="kv-v" value="${esc(v)}" placeholder="${esc(k.p || '')}"${hidden}>
    </label>`;
  }).join("");
}

function buildPanel(builders, body, footer, title) {
  const bd = builders.map(b => b()).join("\n");
  if (body) body.innerHTML = bd;
  if (footer) footer.innerHTML = (typeof footer._html === 'function') ? footer._html() : '';
}

// สร้างแถวข้อประเมิน (SC 2/1/0/N-A) ใช้กับแบบประเมินทุกส่วน
function scRow(item, groupId, name, map) {
  const opts = (map || ALL_SC).map(s =>
    `<button type="button" class="sc ${s.cls}" data-sc="${s.label}" data-group="${groupId}">${s.label}<small>${esc(s.hint)}</small></button>`
  ).join("");
  return `<div class="it" data-key="${esc(name)}">
    <div class="i-head"><button type="button" class="i-toggle">▾</button><b>${esc(item.t)}</b>${item.h ? `<small class="i-h">${esc(item.h)}</small>` : ''}</div>
    <div class="i-body">
      <div class="sc-row" data-key="${esc(name)}">${opts}</div>
      <textarea class="note" data-n key="n:${name}" placeholder="หลักฐาน/ข้อสังเกต (บันทึกได้)" rows="2"></textarea>
    </div>
  </div>`;
}

// รวมคะแนน SC จาก state ภายใต้ key prefix (เช่น "p1" -> keys "p1:1".."p1:22")
function sumSc(prefix, state) {
  let sum = 0;
  for (const [k, v] of Object.entries(state)) {
    if (k.startsWith(prefix + ":") && typeof v === 'number') sum += v;
  }
  return sum;
}
function sumScFor(keys) {
  return keys.reduce((a, k) => a + (typeof k.v === 'number' ? k.v : 0), 0);
}