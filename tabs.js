// ============================================================
// แท็บการนิเทศ 7 แท็บ (ตามเครื่องมือ/ส่วนของคู่มือ) + บันทึกผล + ประวัติ + สถิติ
// ============================================================
let STATE = { answers: {}, notes: {}, multibasic: {}, multiVals: {}, basic: {}, evalMeta: { formType: ROUNDS[0].v, round: "" } };

function sumSc(prefix) {
  let s = 0;
  for (const [k, v] of Object.entries(STATE.answers)) {
    const kb = k.split(":");
    if (kb[0] === prefix && typeof v === 'number') s += v;
  }
  return s;
}

// ---------- ส่วนที่ 1 (ส่วนกลางทุกโรงเรียน ข้อ1-22) ----------
function part1ItemsHtml() {
  return PART1_GROUPS.map(g => {
    const vals = g.items.map(it => {
      const key = "part1:" + it.n;
      return `<div class="it" data-key="${key}">
        <div class="i-head"><span class="i-n">${String(it.n).padStart(2, '0')}</span><b>${esc(it.t)}</b></div>
        <div class="i-body">
          <div class="sc-row" data-key="${key}">${ALL_SC.map(s => scBtn(key, s)).join('')}</div>
          <div class="note-cont"><span class="lbl">หลักฐาน/ข้อสังเกต</span><textarea class="note" data-key="n:${key}" rows="2" placeholder="บันทึกหลักฐาน ข้อสังเกต หรือสิ่งที่สังเกตได้"></textarea></div>
        </div>
      </div>`;
    }).join('');
    return `<div class="grp"><div class="grp-h">${esc(g.group)}</div>${vals}</div>`;
  }).join('');
}

// ---------- ส่วนที่ 2 (สามัญควบคู่ศาสนา ข้อ23-30) ----------
function part2ItemsHtml() {
  return ALL_PART2.map(it => {
    const key = "part2:" + it.n;
    return `<div class="it">
      <div class="i-head"><span class="i-n">${String(it.n).padStart(2, '0')}</span><b>${esc(it.t)}</b></div>
      <div class="i-body">
        <div class="sc-row" data-key="${key}">${ALL_SC.map(s => scBtn(key, s)).join('')}</div>
        <div class="note-cont"><span class="lbl">หลักฐาน/ข้อสังเกต</span><textarea class="note" data-key="n:${key}" rows="2" placeholder="บันทึกหลักฐาน ข้อสังเกต"></textarea></div>
      </div>
    </div>`;
  }).join('');
}

function scBtn(key, s) {
  return `<button type="button" class="sc ${s.cls}" data-key="${key}" data-sc="${s.label}">${s.label}<small>${s.hint}</small></button>`;
}

function noteInputHtml(label) {
  return `<div class="note-cont"><span class="lbl">${esc(label)}</span><textarea class="note" rows="3" placeholder="กรอกรายละเอียด"></textarea></div>`;
}

// ---------- การเลือก / state ----------
function bindPanelEvents(root) {
  root.addEventListener('click', e => {
    const btn = e.target.closest('button.sc');
    if (btn) {
      const key = btn.dataset.key, v = btn.dataset.sc;
      root.querySelectorAll(`button.sc[data-key="${key}"]`).forEach(b => b.classList.remove('scsel'));
      btn.classList.add('scsel');
      if (v === 'N/A') STATE.answers[key] = null; else STATE.answers[key] = Number(v);
      updateScoreBar();
      return;
    }
    const download = e.target.closest('.btn-download, .btn-print');
    if (download) return;
  });
  root.addEventListener('input', e => {
    const ta = e.target.closest('textarea.note');
    if (ta) {
      const key = ta.dataset.key;
      if (key) STATE.notes[key] = ta.value;
    }
    const kv = e.target.closest('.kv-v');
    if (kv) {
      const t = kv.closest('[data-key]');
      if (t) STATE.basic[t.dataset.key] = kv.value;
    }
  });
}

function updateScoreBar() {
  const bar = $('#scoreBar');
  if (!bar) return;
  const s1 = sumSc('part1');
  const pct = Math.round(s1 / 44 * 100);
  const lv = getLevel(pct);
  bar.innerHTML = `<span class="chip" style="background:${getColor(pct)}">ส่วนที่ 1: ${s1}/44 (${pct}%) — ${lv}</span>`;
}

// ข้อมูลโรงเรียนเสมอสำหรับทุกรอบ
function schoolMetaHeader() {
  return `<div class="meta-box">
    <div class="meta-row"><label>ชื่อสถานศึกษา:<b>${esc(SELECTED ? SELECTED.name : '')}</b></label>
      <label>รหัส:<b>${esc(SELECTED ? SELECTED.id : '')}</b></label>
      <label>รูปแบบ:<b>${esc(SELECTED ? (SCHOOLS.find(x=>x.id===SELECTED.id)||{}).form : '')}</b></label>
    </div>
  </div>`;
}

// ============================================================
// แท็บ 1: ข้อมูลพื้นฐาน + เครื่องมือที่ 1
// ============================================================
function buildTab1() {
  const root = el('tab-1');
  root.innerHTML = `<div class="panel-head"><h2>📁 เครื่องมือที่ 1 แบบบันทึกข้อมูลพื้นฐานสถานศึกษา</h2></div>
  <div class="note" style="background:#ecfeff;border-left:4px solid #0e7490">บันทึกเป็นรอบปีการศึกษา (ปีละ 2 ครั้ง) เมื่อเลือกสถานศึกษาและรอบการนิเทศแล้ว ระบบจะแสดงข้อมูลพื้นฐานให้ตรวจทาน และบันทึกข้อมูลอื่น ๆ ที่เกี่ยวข้อง</div>
  <div class="form-wrap">
    <div class="kv-grid">${renderKeyvals([
      { k: "ชื่อสถานศึกษา", value: SELECTED ? (SELECTED.name||'') : '', p: "ชื่อเต็มของสถานศึกษา", dk: 'name' },
      { k: "อำเภอ", value: SELECTED ? (SELECTED.dist||'') : '', p: "อำเภอ", dk: 'dist' },
      { k: "ตำบล", value: SELECTED ? (SELECTED.subdist||'') : '', p: "ตำบล", dk: 'subdist' },
      { k: "ที่อยู่", value: SELECTED ? (SELECTED.address||'') : '', p: "บ้านเลขที่ หมู่ ตำบล อำเภอ", dk: 'address' },
      { k: "โทรศัพท์", value: SELECTED ? (SELECTED.phone||'') : '', p: "เบอร์ติดต่อ", dk: 'phone' },
      { k: "รูปแบบการจัดการศึกษา", value: (SCHOOLS.find(x=>x.id===SELECTED.id)||{}).form || 'แบบสอนสามัญ', dk: 'form' }
    ])}
    </div>
    <div class="sep"></div>
    <div class="sec-h">ข้อมูล ณ วันที่นิเทศ</div>
    <div class="kv-grid">${renderKeyvals([
      { k: "จำนวนนักเรียน", value: SELECTED ? (SELECTED.students||'') : '', p: "จำนวนนักเรียนทั้งหมด", dk: 'students' },
      { k: "จำนวนครู", value: SELECTED ? (SELECTED.staff||'') : '', p: "จำนวนครู/บุคลากร", dk: 'staff' },
      { k: "ผู้บริหาร", value: SELECTED ? (SELECTED.admin||'') : '', p: "ชื่อผู้บริหาร", dk: 'admin' },
      { k: "ผู้ให้ข้อมูล", value: '', p: "ชื่อ-ตำแหน่งผู้ให้ข้อมูล", dk: 'informant' },
      { k: "วันที่นิเทศ", value: new Date().toISOString().slice(0,10), dk: 'evalDate' }
    ])}
    </div>
    <div class="sec-h">รอบการนิเทศ / ประเภทการนิเทศ</div>
    <div class="kv-grid">${ROUNDS.map(r => `<label class="round"><input type="radio" name="formType" value="${esc(r.v)}" ${r === ROUNDS[0] ? 'checked' : ''}><span><b>${esc(r.v)}</b><small>${esc(r.note)}</small></span></label>`).join('')}</div>
  </div>`;
  root.querySelectorAll('input[name=formType]').forEach(r => r.addEventListener('change', () => { STATE.evalMeta.formType = r.value; }));
  root.querySelectorAll('.kv-v').forEach(x => {
    const dk = x.closest('label').dataset.key;
    x.addEventListener('input', () => {
      STATE.basic[dk] = x.value;
      if (dk === 'name') { /* แสดงผลเมื่อบันทึกแล้ว */ }
    });
  });
  // ย้าย: ใช้ updateScoreBar display ได้ (bar อยู่ด้านบนทุกแท็บ)
}

// ============================================================
// แท็บ 2: การบริหารและระบบคุณภาพ (ส่วนที่ 1 ด้าน 1-5 + วนให้ครบข้อ1-22)
// ============================================================
function buildTab2() {
  const root = el('tab-2');
  root.innerHTML = `<div class="panel-head"><h2>🏛️ ส่วนที่ 1 ประเด็นกลาง (ข้อ 1-22) — ทุกสถานศึกษา</h2>
    <div class="hint">ให้คะแนน: <b>2</b>=ทำได้ชัดเจน <b>1</b>=กำลังพัฒนา <b>0</b>=ต้องได้รับการช่วยเหลือ <b>N/A</b>=ไม่เกี่ยวข้อง</div></div>
  <div class="form-wrap">${part1ItemsHtml()}</div>`;
  bindPanelEvents(root);
}

// ============================================================
// แท็บ 3: หลักสูตรและการจัดการเรียนรู้ (ส่วนที่ 1 ด้าน 2-3 → ข้อ 5-14)
// ============================================================
function buildTab3() {
  const keyRange = [5,6,7,8,9,10,11,12,13,14]; // D2 (ข้อ5-8) + D3 (ข้อ9-14)
  const items = keyRange.map(n => ALL_PART1[n-1]);
  const root = el('tab-3');
  root.innerHTML = `<div class="panel-head"><h2>📚 หลักสูตรและการจัดการเรียนรู้ (ด้าน 2-3)</h2>
    <div class="hint">ให้คะแนน <b>2/1/0/N-A</b> พร้อมบันทึกหลักฐาน</div></div>
  <div class="form-wrap">${
    PART1_GROUPS.filter(g => g.items.some(i => keyRange.includes(i.n))).map(g =>
      `<div class="grp"><div class="grp-h">${esc(g.group)}${g.items.some(i=>i.n>=5&&i.n<=8)?' (ข้อ 5-8)':'(ข้อ 9-14)'}</div>${
        g.items.filter(i=>keyRange.includes(i.n)).map(it=>{
          const key="part1:"+it.n;
          return `<div class="it"><div class="i-head"><span class="i-n">${String(it.n).padStart(2,'0')}</span><b>${esc(it.t)}</b></div>
            <div class="i-body"><div class="sc-row" data-key="${key}">${ALL_SC.map(s=>scBtn(key,s)).join('')}</div>
            <div class="note-cont"><span class="lbl">หลักฐาน/ข้อสังเกต</span><textarea class="note" data-key="n:${key}" rows="2"></textarea></div></div></div>`;
        }).join('')
      }</div>`
    ).join('')
  }</div>`;
  bindPanelEvents(root);
}

// ============================================================
// แท็บ 4: การวัดประเมินผลและผลผู้เรียน (ด้าน 4-5 → ข้อ 15-22) + ส่วนที่ 4 สุ่มตรวจ
// ============================================================
function buildTab4() {
  const k1 = [15,16,17,18,19,20,21,22];
  const root = el('tab-4');
  root.innerHTML = `<div class="panel-head"><h2>📊 การวัดประเมินผลและผลที่เกิดขึ้นกับผู้เรียน (ด้าน 4-5)</h2>
    <div class="hint">ให้คะแนน <b>2/1/0/N-A</b> + ส่วนที่ 4 การสุ่มตรวจผลการเรียนรู้ของผู้เรียน (พบชัดเจน/พบบางส่วน/ควรพัฒนา)</div></div>
  <div class="form-wrap">
    ${PART1_GROUPS.filter(g=>g.items.some(i=>k1.includes(i.n))).map(g=>`
      <div class="grp"><div class="grp-h">${esc(g.group)} (ข้อ ${Math.min(...g.items.map(i=>i.n))}-${Math.max(...g.items.map(i=>i.n))})</div>
      ${g.items.filter(i=>k1.includes(i.n)).map(it=>{const key="part1:"+it.n;return `
        <div class="it"><div class="i-head"><span class="i-n">${String(it.n).padStart(2,'0')}</span><b>${esc(it.t)}</b></div>
        <div class="i-body"><div class="sc-row" data-key="${key}">${ALL_SC.map(s=>scBtn(key,s)).join('')}</div>
        <div class="note-cont"><span class="lbl">หลักฐาน/ข้อสังเกต</span><textarea class="note" data-key="n:${key}" rows="2"></textarea></div></div></div>`;
      }).join('')}</div>`).join('')}
    <div class="sep"></div>
    <div class="grp"><div class="grp-h">ส่วนที่ 4 การสุ่มตรวจผลการเรียนรู้ของผู้เรียน (2=พบชัดเจน 1=พบบางส่วน 0=ควรพัฒนา)</div>
    ${CHECK4_ITEMS.map((c,i)=>{const key="ck4:"+(i+1);return `
      <div class="it"><div class="i-head"><span class="i-n">${String(i+1).padStart(2,'0')}</span><b>${esc(c.t)}</b></div>
      <div class="i-body"><div class="sc-row" data-key="${key}">${([SC2,SC1,SC0]).map(s=>scBtn(key,s)).join('')}</div>
      <div class="note-cont"><span class="lbl">ผลการตรวจ/หลักฐาน</span><textarea class="note" data-key="n:${key}" rows="2"></textarea></div></div></div>`;
    }).join('')}</div>
  </div>`;
  bindPanelEvents(root);
}

// ============================================================
// แท็บ 5: การตรวจเยี่ยมชั้นเรียน (ส่วนที่ 3 ฉบับสั้น) + ข้อมูลชั้นเรียน
// ============================================================
function buildTab5() {
  const root = el('tab-5');
  root.innerHTML = `<div class="panel-head"><h2>🧐 ส่วนที่ 3 การตรวจเยี่ยมชั้นเรียน (ฉบับสั้น 8 ข้อ)</h2>
    <div class="hint">ระดับ: <b>2</b>=พบชัดเจน <b>1</b>=พบบางส่วน <b>0</b>=ควรพัฒนา — ใช้เวลาสังเกต 30-45 นาที/ชั้น</div></div>
  <div class="form-wrap">
    <div class="grp"><div class="grp-h">ข้อมูลการสังเกตชั้นเรียน</div>
      <div class="kv-grid">${renderKeyvals([
        { k: "ชั้นที่ตรวจเยี่ยม", value: '', p: "เช่น ป.4 / ม.3", dk: 'clsLevel' },
        { k: "รายวิชา", value: '', p: "วิชาที่สังเกต", dk: 'clsSubject' },
        { k: "เรื่องที่สอน", value: '', p: "เนื้อหาบทเรียน", dk: 'clsTopic' },
        { k: "จำนวนผู้เรียน", value: '', p: "จำนวนนักเรียนในห้อง", dk: 'clsCount' },
        { k: "ระยะเวลาที่สังเกต (นาที)", value: '', p: "เช่น 40", dk: 'clsTime' }
      ])}</div>
    </div>
    ${CLASS3_ITEMS.map((c,i)=>{const key="cl3:"+(i+1);return `
      <div class="it"><div class="i-head"><span class="i-n">${String(i+1).padStart(2,'0')}</span><b>${esc(c.t)}</b></div>
      <div class="i-body"><div class="sc-row" data-key="${key}">${([SC2,SC1,SC0]).map(s=>scBtn(key,s)).join('')}</div>
      <div class="note-cont"><span class="lbl">ข้อสังเกต</span><textarea class="note" data-key="n:${key}" rows="2"></textarea></div></div></div>`;
    }).join('')}
  </div>`;
  bindPanelEvents(root);
}

// ============================================================
// แท็บ 6: สะท้อนผลและแผนพัฒนา (ส่วนที่ 5-7) + AI
// ============================================================
function buildTab6() {
  const root = el('tab-6');
  root.innerHTML = `<div class="panel-head"><h2>🔧 ส่วนที่ 5-7 การสะท้อนผล จุดแข็ง ประเด็นพัฒนา และข้อตกลงเพื่อการพัฒนา</h2>
    <div class="hint">กรอกตามเกณฑ์ของคู่มือ จากนั้นใช้ปุ่ม "✨ ประมวลผลด้วย AI" เพื่อร่างข้อตกลงการพัฒนาอัตโนมัติ</div></div>
  <div class="form-wrap">
    <div class="grp"><div class="grp-h">ส่วนที่ 5 สรุปผลการนิเทศรายโรงเรียน</div>
      <div class="strength-wrap">
        ${[1,2,3].map(i=>`
          <div class="strength-row" data-i="${i}"><b>จุดแข็งที่ ${i}</b>
            <input type="text" class="strength-inp" data-i="${i}" placeholder="จุดแข็ง (ถ้ามี)">
            <button type="button" class="btn mins" data-del="${i}" title="ลบ">🗑</button>
          </div>`).join('')}
      </div>
      <div class="note-cont"><span class="lbl">ประเด็นที่ควรพัฒนา (1-3 ประเด็น)</span><textarea class="note" data-key="develop" rows="3" placeholder="เช่น 1. ... 2. ... 3. ..."></textarea></div>
    </div>
    <div class="grp"><div class="grp-h">ส่วนที่ 6 ความต้องการการสนับสนุน (เลือกได้หลายข้อ)</div>
      <div class="chk-grid">${SUPPORT_OPTIONS.map((o,i)=>`<label class="supchk"><input type="checkbox" value="${esc(o)}" data-i="${i}"><span>${esc(o)}</span></label>`).join('')}</div>
      <div class="note-cont"><span class="lbl">อื่น ๆ / ข้อเสนอเพิ่มเติม</span><textarea class="note" data-key="support_etc" rows="2"></textarea></div>
    </div>
    <div class="grp"><div class="grp-h">ส่วนที่ 7 ข้อตกลงเพื่อการพัฒนา (Agreement)</div>
      <table class="agree-tb" id="agreeTb">
        <thead><tr><th>ประเด็นที่จะพัฒนา</th><th>สิ่งที่จะดำเนินการ</th><th>ผู้รับผิดชอบ</th><th>ผู้สนับสนุน</th><th>หลักฐานที่จะดูครั้งต่อไป</th><th>กำหนดติดตาม</th><th></th></tr></thead>
        <tbody></tbody>
      </table>
      <div class="toolbar"><button type="button" class="btn btn-add" id="agreeAdd">+ เพิ่มแถวข้อตกลง</button>
      <button type="button" class="btn" id="aiDraft">✨ ประมวลผลด้วย AI (ร่างข้อตกลง)</button></div>
    </div>
  </div>`;
  bindPanelEvents(root);
  root.querySelector('#agreeAdd').addEventListener('click', () => addAgreeRow({}));
  root.querySelector('#aiDraft').addEventListener('click', aiDraftAgreement);
  addAgreeRow({});
}
function addAgreeRow(row) {
  const tb = $('#agreeTb tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = ['agree_1','agree_2','agree_3','agree_4','agree_5','agree_6'].map((k,i)=>{
    const val = row[k] || '';
    return `<td><input class="agree-inp" data-k="${k}" value="${esc(val)}"></td>`;
  }).join('') + `<td><button type="button" class="btn mins del-row">✕</button></td>`;
  tb.appendChild(tr);
  return tr;
}

// ---------- แท็บ 7: ติดตามและสรุป (ส่วนที่ 8-9 + ลงชื่อ) ----------
function buildTab7() {
  const root = el('tab-7');
  root.innerHTML = `<div class="panel-head"><h2>✅ ส่วนที่ 8-9 การติดตามในภาคเรียนถัดไป และสรุปการนิเทศ</h2>
    <div class="hint">รอบที่ 2 (ภาคเรียนที่ 2) ใช้ตอบการติดตามผลจากข้อตกลงครั้งก่อน ไม่ต้องประเมินใหม่ทุกเรื่อง</div></div>
  <div class="form-wrap">
    <div class="grp"><div class="grp-h">ส่วนที่ 8 การติดตามในภาคเรียนถัดไป</div>
      <div class="kv-grid">${renderKeyvals([
        { k: "ผลการดำเนินงานตาม" , value: '', p: "ข้อตกลงครั้งก่อน", dk: 'f1' },
        { k: "ปัญหา/อุปสรรค", value: '', p: "อุปสรรคระหว่างดำเนินการ", dk: 'f2' },
        { k: "การช่วยเหลือจากหน่วยงาน", value: '', p: "ข้อช่วยเหลือ/สนับสนุน", dk: 'f3' },
        { k: "สถานะการพัฒนาสถานศึกษา", value: '', p: "สรุปสถานะ", dk: 'fStatus' }
      ])}</div>
      <div class="sec-h">สถานะการพัฒนา (สรุปตาม 4 เกณฑ์)</div>
      <div class="status-row">${['ได้รับการพัฒนาอย่างต่อเนื่อง','กำลังพัฒนา','ยังไม่พัฒนา','ถดถอย'].map((s,i)=>`<label class="rstatus"><input type="radio" name="statusDev" value="${esc(s)}"><span>${esc(s)}</span></label>`).join('')}</div>
    </div>
    <div class="grp"><div class="grp-h">ส่วนที่ 9 สรุป 5 คำถามก่อนจบการนิเทศ</div>
      ${SUMMARY_Q.map((q,i)=>`
        <div class="q"><b>${i+1}. ${esc(q)}</b><textarea class="note" data-key="sum:${i+1}" rows="2"></textarea></div>`).join('')}
    </div>
    <div class="grp"><div class="grp-h">ลงชื่อ / ผู้รับรอง</div>
      <div class="kv-grid">${renderKeyvals([
        { k: "ผู้บริหารสถานศึกษา", value: '', p: "ชื่อ - ลายมือชื่อ", dk: 'sigAdmin' },
        { k: "หัวหน้าคณะนิเทศ", value: CURRENT_USER ? CURRENT_USER.fname : '', p: "ชื่อหัวหน้าคณะนิเทศ", dk: 'sigLead' },
        { k: "ผู้บันทึกข้อมูล", value: CURRENT_USER ? CURRENT_USER.fname : '', p: "ชื่อผู้บันทึก", dk: 'sigRecord' },
        { k: "วันที่", value: new Date().toISOString().slice(0,10), dk: 'sigDate' }
      ])}</div>
    </div>
  </div>`;
  bindPanelEvents(root);
}

// ============================================================
// จัดการการแสดง panel + switchTab
// ============================================================
function switchTab(id) {
  ['tab-1','tab-2','tab-3','tab-4','tab-5','tab-6','tab-7','tab-files','tab-hist','tab-stats','tab-users','tab-info'].forEach(t =>
    $(`#${t}`).classList.toggle('active', t === id));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.target === id));
  sidebarTouched = true;
}
function buildAll() {
  buildTab1(); buildTab2(); buildTab3(); buildTab4(); buildTab5(); buildTab6(); buildTab7();
  if (SELECTED) { initPinBar(); }
  updateScoreBar();
}

// ============================================================
// บันทึกผลการนิเทศ
// ============================================================
function collectResult() {
  if (!SELECTED) return null;
  const t = SELECTED;
  const f = SCHOOLS.find(x => x.id === SELECTED.id) || {};
  const basic = {};
  document.querySelectorAll('input.kv-v').forEach(x => {
    const dk = x.closest('label').dataset.key;
    if (dk) basic[dk] = x.value;
  });
  document.querySelectorAll('input[name=formType]:checked').forEach(r => STATE.evalMeta.formType = r.value);

  // จุดแข็ง (สูงสุด 3)
  const strengths = [];
  document.querySelectorAll('input.strength-inp').forEach(x => {
    if (x.value.trim()) strengths.push(x.value.trim());
  });
  // ความต้องการสนับสนุน
  const support = [];
  document.querySelectorAll('.supchk input:checked').forEach(x => support.push(x.value));
  const support_etc = (document.querySelector('[data-key=support_etc]') || {}).value || '';

  // ข้อตกลง
  const agreements = [];
  document.querySelectorAll('#agreeTb tbody tr').forEach(tr => {
    const row = {};
    tr.querySelectorAll('input.agree-inp').forEach(inp => row[inp.dataset.k] = inp.value);
    if (Object.values(row).some(v => v)) agreements.push(row);
  });

  const fiveQ = {};
  for (let i = 1; i <= 5; i++) fiveQ[i] = ((document.querySelector(`[data-key="sum:${i}"]`) || {}).value || '');

  const s1 = sumSc('part1');
  const s2 = sumSc('part2');
  const s3 = sumSc('cl3');
  const s4 = sumSc('ck4');
  const pct = Math.round(s1 / 44 * 100);
  const level = getLevel(pct);

  const basicData = {
    name: basic.name !== undefined && basic.name !== '' ? basic.name : t.name,
    id: t.id,
    evalDate: basic.evalDate || new Date().toISOString().slice(0,10),
    informant: basic.informant || ''
  };
  const evalData = {
    formType: STATE.evalMeta.formType || ROUNDS[0].v,
    round: STATE.evalMeta.formType || ROUNDS[0].v,
    answers: STATE.answers,
    notes: { support_etc, develop: (document.querySelector('[data-key=develop]')||{}).value || '' , ...STATE.notes },
    basic: { ...basic, ...t },
    strengths, develop: (document.querySelector('[data-key=develop]')||{}).value || '',
    support, agreements,
    basicData,
    s1, s2, s3, s4, totalScore: s1, pct, level,
    avgS1: s1
  };
  evalData.followUp = {
    f1: basic.f1, f2: basic.f2, f3: basic.f3, f4: basic.f4, fStatus: basic.fStatus || '',
    statusDev: (document.querySelector('input[name=statusDev]:checked') || {}).value || ''
  };
  evalData.sigAdmin = basic.sigAdmin || '';
  evalData.sigLead = basic.sigLead || '';
  evalData.sigRecord = basic.sigRecord || '';
  evalData.evalDate = basic.sigDate || basic.evalDate || new Date().toISOString().slice(0,10);
  return { schoolData: { row: t.row, id: t.id, name: basicData.name, address: basic.address, dist: basic.dist, subdist: basic.subdist, phone: basic.phone, form: basic.form || f.form, admin: basic.admin, staff: basic.staff, students: basic.students }, evalData };
}

async function saveResult(editRow) {
  const payload = collectResult();
  if (!payload) { toast("กรุณาเลือกสถานศึกษาก่อน", false); return; }
  if (payload.evalData.s1 === 0 && Object.keys(STATE.answers).length === 0) {
    toast("ยังไม่มีการให้คะแนนหรือบันทึกข้อมูล — หากต้องการบันทึก โปรดให้คะแนนอย่างน้อย 1 ข้อ", false);
    return;
  }
  const res = await post('saveSchoolEvaluation', { ...payload, supervisor: CURRENT_USER ? (CURRENT_USER.fname + ' (' + CURRENT_USER.username + ')') : '', editRow: editRow || null });
  if (res && res.success) {
    toast(res.message || 'บันทึกเรียบร้อยแล้ว', true);
    clearDraft();
    if (SELECTED) SELECTED = { ...SELECTED, ...payload.schoolData };
    showEvalHistory();
  } else {
    toast((res && res.message) || 'บันทึกไม่สำเร็จ', false);
  }
}

// ============================================================
// AI: ร่างข้อตกลงเพื่อการพัฒนา
// ============================================================
async function aiDraftAgreement() {
  const collect = collectResult();
  if (!collect) return;
  const c = collect.evalData;
  const prompt = "โรงเรียน " + c.basicData.name + " ผลการนิเทศ: ส่วนที่1 " + c.s1 + "/44 (" + c.pct + "%) ระดับ " + c.level +
    "\nจุดแข็ง: " + (c.strengths.join(', ') || '-') +
    "\nประเด็นพัฒนา: " + (c.develop || '-') +
    "\nความต้องการสนับสนุน: " + (c.support.join(', ') || '-') +
    "\n\nจงร่างตารางข้อตกลงเพื่อการพัฒนา (Agreement) ไม่เกิน 3 แถว โดยแต่ละแถวประกอบด้วย: ประเด็นที่จะพัฒนา, สิ่งที่จะดำเนินการ, ผู้รับผิดชอบ, ผู้สนับสนุน, หลักฐานที่จะดูครั้งต่อไป, กำหนดติดตาม — ตอบเป็น JSON array เช่น [{\"agree_1\":\"...\",\"agree_2\":\"...\",\"agree_3\":\"...\",\"agree_4\":\"...\",\"agree_5\":\"...\",\"agree_6\":\"...\"}]";
  toast("กำลังประมวลผลด้วย AI ...", false);
  const r = await post('chat', prompt);
  try {
    const data = JSON.parse(r.reply.replace(/```json|```/g, '').trim());
    if (Array.isArray(data)) {
      document.querySelectorAll('#agreeTb tbody tr').forEach(tr => tr.remove());
      data.forEach(row => addAgreeRow(row));
      toast("AI ร่างข้อตกลง เรียบร้อย — ตรวจทานและแก้ไขก่อนบันทึก", true);
    }
  } catch (e) {
    toast("AI ตอบไม่สามารถแปลงเป็นตารางได้: " + r.reply.slice(0, 80), false);
  }
}

// ============================================================
// ไฟล์หลักฐาน (เก็บใน Drive opec-uploads)
// ============================================================
async function showUploadsPanel() {
  switchTab('tab-files');
  const wrap = $('#filesWrap');
  if (!SELECTED) { wrap.innerHTML = `<div class="empty">กรุณาเลือกสถานศึกษา เพื่อจัดการไฟล์หลักฐาน</div>`; return; }
  wrap.innerHTML = `<div class="form-wrap">
    <div class="grp">
      <div class="grp-h">📎 ไฟล์หลักฐานการนิเทศ — ${esc(SELECTED.name)}</div>
      <div class="upload-row">
        <input type="file" id="filePick" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx">
        <button class="btn btn-primary" onclick="doUpload()">⬆️ อัปโหลด</button>
      </div>
      <div class="hint" style="margin:6px 0 10px">รองรับภาพถ่าย เอกสาร PDF/Word/Excel ในโฟลเดอร์ Drive "opec-uploads" (แยกตามรหัสโรงเรียน) — ไม่เกิน 8MB/ไฟล์</div>
      <div id="fileList" class="file-list"></div>
    </div>
  </div>`;
  refreshFiles();
}

async function refreshFiles() {
  const box = $('#fileList');
  if (!box) return;
  box.innerHTML = `<div class="loading">กำลังโหลดไฟล์...</div>`;
  const r = await post('getUploads', { schoolId: SELECTED.id });
  if (!r || !r.success) { box.innerHTML = `<div class="empty">${esc((r||{}).message || 'โหลดไม่สำเร็จ')}</div>`; return; }
  const list = r.data || [];
  if (!list.length) { box.innerHTML = `<div class="empty">ยังไม่มีไฟล์หลักฐานของโรงเรียนนี้</div>`; return; }
  box.innerHTML = list.map(f => `<div class="file-row">
    <span class="file-ic">📄</span>
    <div class="file-info"><b>${esc(f.name)}</b><small>${f.sizeKb} KB · ${esc(f.date)}</small></div>
    <div class="file-act">
      <a class="btn btn-mini" href="${esc(f.dl)}" target="_blank" rel="noopener">⬇️ เปิด/ดาวน์โหลด</a>
      <button class="btn btn-mini btn-del" onclick="deleteUpload('${esc(f.id)}')">🗑 ลบ</button>
    </div>
  </div>`).join('');
}

async function doUpload() {
  const input = $('#filePick');
  const files = input && input.files;
  if (!files || !files.length) { toast('เลือกไฟล์ก่อน', false); return; }
  for (const f of files) {
    if (f.size > 8 * 1024 * 1024) { toast('ไฟล์ "' + f.name + '" ใหญ่เกิน 8MB', false); continue; }
    toast('กำลังอัปโหลด "' + f.name + '" ...', false);
    const compressed = await compressImage(f);
    const reader = new FileReader();
    reader.onload = async () => {
      const data64 = String(reader.result).split(',')[1];
      const r = await post('uploadFile', { schoolId: SELECTED.id, filename: compressed.name, mime: compressed.type || 'application/octet-stream', data64 });
      if (r && r.success) { toast(r.message, true); refreshFiles(); }
      else toast((r || {}).message || 'อัปโหลดไม่สำเร็จ', false);
    };
    reader.readAsDataURL(compressed);
  }
  input.value = '';
}

async function deleteUpload(id) {
  if (!confirm('ยืนยันลบไฟล์นี้?')) return;
  const r = await post('deleteUpload', { id, username: CURRENT_USER ? CURRENT_USER.username : '' });
  if (r && r.success) { toast(r.message, true); refreshFiles(); }
  else toast((r || {}).message || 'ลบไม่สำเร็จ', false);
}

// ============================================================
// ประวัติการนิเทศ
// ============================================================
async function showEvalHistory() {
  switchTab('tab-hist');
  const wrap = $('#histWrap');
  if (!SELECTED) { wrap.innerHTML = `<div class="empty">กรุณาเลือกสถานศึกษา เพื่อดูประวัติการนิเทศ</div>`; return; }
  wrap.innerHTML = `<div class="loading">กำลังโหลดข้อมูล...</div>`;
  const r = await post('getSchoolEvaluations', SELECTED.id);
  if (!r || !r.success) { wrap.innerHTML = `<div class="empty">โหลดไม่สำเร็จ</div>`; return; }
  const list = r.data;
  if (!list.length) {
    wrap.innerHTML = `<div class="empty">ยังไม่มีประวัติการนิเทศของ ${esc(SELECTED.name)}</div>`;
    return;
  }
  wrap.innerHTML = `<div class="hist-list">` + list.map((h, i) => {
    const d = h.details || {};
    return `<div class="hist-card">
      <div class="hist-top"><b>${esc(h.form || '')}</b><span>${esc(h.timestamp)}</span></div>
      <div class="hist-scores">ส่วนที่1 ${h.s1}/44 · ผ่าน ${h.pct}% · ระดับ ${esc(h.level)}</div>
      <div class="hist-notes">
        <div><b>จุดแข็ง:</b> ${esc((d.strengths || []).length ? d.strengths.join(' · ') : '-')}</div>
        <div><b>ประเด็นพัฒนา:</b> ${esc(d.develop || '-')}</div>
        <div><b>ความต้องการสนับสนุน:</b> ${esc((d.support || []).join(' · ') || '-')}</div>
      </div>
      <div class="hist-actions">
        <button class="btn" onclick="loadHistoryRow(${h.row})">🔎 เห็นรายละเอียด / แก้ไข</button>
        ${CURRENT_USER && CURRENT_USER.role === 'ผู้ดูแลระบบ' ? `<button class="btn btn-del" onclick="deleteEvalRow(${h.row})">🗑 ลบ</button>` : ''}
      </div>
    </div>`;
  }).join('') + `</div>`;
}

async function deleteEvalRow(row) {
  if (!confirm("ยืนยันลบผลการนิเทศแถวนี้? (ทำแล้วไม่สามารถกู้คืน)")) return;
  const r = await post('deleteSchoolEvaluation', { row, admin: CURRENT_USER ? CURRENT_USER.username : '' });
  if (r && r.success) { toast("ลบเรียบร้อย", true); showEvalHistory(); }
  else toast((r && r.message) || "ลบไม่สำเร็จ", false);
}

function loadHistoryRow(row) {
  // โหลดข้อมูลแล้วดึงเข้าฟอร์ม (อยู่ใน DATA — backend อ่าน fields แยก): refresh แบบง่าย
  toast("จะเปิดรายละเอียดผ่านการแก้ไขโดยตรง (รองรับในปุ่ม 'เปิดข้อมูล')", false);
}

// ============================================================
// สถิติ
// ============================================================
async function showStatsPanel() {
  switchTab('tab-stats');
  const wrap = $('#statsWrap');
  wrap.innerHTML = `<div class="loading">กำลังโหลดสถิติ...</div>`;
  const r = await post('getStatsSchool');
  if (!r || !r.success) { wrap.innerHTML = `<div class="empty">โหลดไม่สำเร็จ</div>`; return; }
  const d = r.data;
  wrap.innerHTML = `
    <div class="stat-grid">
      <div class="stat-card"><b>${d.totalSchools}</b><span>สถานศึกษา</span></div>
      <div class="stat-card"><b>${d.totalEval}</b><span>ครั้งที่นิเทศ</span></div>
      <div class="stat-card"><b>${d.totalUsers}</b><span>ผู้ใช้ระบบ</span></div>
      <div class="stat-card"><b>${d.avgPct}</b><span>ค่าเฉลี่ย (%)</span></div>
    </div>
    <div class="stat-grid">
      <div class="stat-card"><b>${d.staff}</b><span>ครู/บุคลากรรวม</span></div>
      <div class="stat-card"><b>${d.students}</b><span>นักเรียนรวม</span></div>
      <div class="stat-card"><b>${d.typeCount['แบบสอนสามัญ'] || 0}</b><span>แบบสามัญ</span></div>
      <div class="stat-card"><b>${d.typeCount['แบบสอนสามัญควบคู่ศาสนาอิสลาม'] || 0}</b><span>สามัญควบคู่ศาสนา</span></div>
    </div>
    <div class="hist-list">` +
    (d.latest.length ? d.latest.map(v => `<div class="hist-card"><b>${esc(v.name)}</b> · ${esc(v.form)} · ส่วนที่1 ${v.pct}% (${esc(v.level)}) · ${esc(v.timestamp)}</div>`).join('') : `<div class="empty">ยังไม่มีข้อมูลการนิเทศ</div>`) +
    `</div>`;
}

// ============================================================
// ผู้ใช้ (admin)
// ============================================================
async function showUsersPanel() {
  switchTab('tab-users');
  const wrap = $('#usersWrap');
  if (!CURRENT_USER || CURRENT_USER.role !== 'ผู้ดูแลระบบ') { wrap.innerHTML = `<div class="empty">เฉพาะผู้ดูแลระบบ</div>`; return; }
  wrap.innerHTML = `<div class="loading">กำลังโหลด...</div>`;
  const r = await post('getUsers', { username: CURRENT_USER.username });
  if (!r || !r.success) { wrap.innerHTML = `<div class="empty">${esc((r||{}).message || 'โหลดไม่สำเร็จ')}</div>`; return; }
  wrap.innerHTML = `<table class="tb">
    <thead><tr><th>Username</th><th>ชื่อ-นามสกุล</th><th>โทร</th><th>บทบาท</th><th>สถานะ</th><th>จัดการ</th></tr></thead>
    <tbody>${r.data.map(u => `<tr>
      <td>${esc(u.username)}</td><td>${esc(u.fname)}</td><td>${esc(u.tel)}</td>
      <td>${esc(u.role)}</td><td><span class="stt ${u.status}">${esc(u.status)}</span></td>
      <td>${u.role !== 'ผู้ดูแลระบบ' ?
        `<button class="btn btn-mini" onclick="userStatus('${esc(u.username)}','ใช้งาน')">เปิดใช้</button>
         <button class="btn btn-mini btn-del" onclick="userStatus('${esc(u.username)}','ระงับ')">ระงับ</button>` : '—'}</td>
    </tr>`).join('')}</tbody></table>`;
}

async function userStatus(u, s) {
  const r = await post('setUserStatus', { admin: CURRENT_USER.username, username: u, status: s });
  if (r && r.success) { toast(r.message, true); showUsersPanel(); }
  else toast((r || {}).message || 'ไม่สำเร็จ', false);
}

// ============================================================
// ช่วยเหลือ / คู่มือ
// ============================================================
function showInfo() {
  switchTab('tab-info');
  $('#infoWrap').innerHTML = `
    <div class="help-card"><h3>📘 วิธีใช้ระบบนิเทศออนไลน์ สถานศึกษาเอกชนในระบบ</h3>
    <p><b>ขั้นตอนแนะนำ :</b></p>
    <ol>
      <li><b>แท็บที่ 1 📁</b> กรอก/ตรวจทานข้อมูลพื้นฐาน และเลือกรอบการนิเทศ (ครั้งที่ 1 หรือ 2)</li>
      <li><b>แท็บที่ 2-5</b> ประเมินตามส่วนที่ 1-4 ของคู่มือ โดยให้คะแนน 2/1/0/N/A พร้อมบันทึกหลักฐาน</li>
      <li><b>แท็บที่ 6 🔧</b> บันทึกจุดแข็ง ประเด็นพัฒนา ความต้องการสนับสนุน และข้อตกลงเพื่อการพัฒนา (ใช้ AI ช่วยร่างได้)</li>
      <li><b>แท็บที่ 7 ✅</b> บันทึกการติดตามภาคเรียนถัดไป สรุป 5 คำถาม และลงชื่อ</li>
      <li><b>แท็บ 📎 ไฟล์/หลักฐาน</b> อัปโหลดภาพถ่าย/เอกสารหลักฐานการนิเทศ เก็บในโฟลเดอร์ Drive "opec-uploads" (แยกตามรหัสโรงเรียน)</li>
      <li>กด <b>💾 บันทึกผลการนิเทศ</b> ที่เมนูด้านบน เพื่อส่งข้อมูลเข้าระบบ</li>
    </ol>
    <p><b>เกณฑ์คะแนน :</b> 2=ทำได้ชัดเจน, 1=กำลังพัฒนา, 0=ต้องได้รับการช่วยเหลือ, N/A=ไม่เกี่ยวข้อง<br>
    ส่วนที่ 1 (ข้อ 1-22) สูงสุด 44 คะแนน → ร้อยละ ≥80 ดีมาก / 60-79 ดี / 40-59 พอใช้ / <40 ต้องปรับปรุง</p>
    <p><b>รอบการนิเทศ :</b> ปีการศึกษาละ 2 ครั้ง (ครั้งที่ 1 ภาคเรียนที่ 1 : ศึกษาสภาพ / ครั้งที่ 2 ภาคเรียนที่ 2 : ติดตามการเปลี่ยนแปลง)</p></div>`;
}