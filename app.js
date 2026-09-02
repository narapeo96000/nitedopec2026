const API_URL = "https://script.google.com/macros/s/AKfycbzOIsAXOkPAL44dOA8KFxZE7WI3TCtS0ceyswLovl3xpzIfZn6O3wr8lou7FLeHw4Ym3Q/exec";
const APP_NAME = "ระบบนิเทศออนไลน์ สถานศึกษาเอกชนในระบบ จ.นราธิวาส";
const MANUAL_NAME = "แผนนิเทศ ติดตาม และตรวจเยี่ยมชั้นเรียนโรงเรียนเอกชนในระบบ จ.นราธิวาส";

// -------------------------------------------------------------
// โครงสร้างแบบนิเทศตามคู่มือ (ข้อ 1-30 + ตรวจเยี่ยม + สุ่มตรวจ)
// 2 = ทำได้ชัดเจน, 1 = กำลังพัฒนา, 0 = ต้องได้รับการช่วยเหลือ, N/A = ไม่เกี่ยวข้อง
// ส่วนที่ 1 (ข้อ1-22) 5 ด้าน / ส่วนที่ 2 (ข้อ23-30) เฉพาะสามัญควบคู่ศาสนา
// -------------------------------------------------------------
const D1 = [
  { t: "1.1 ผู้บริหารมีวิสัยทัศน์ นโยบาย และแผนการพัฒนาคุณภาพสถานศึกษาที่ชัดเจน และสื่อสารสู่ผู้เกี่ยวข้องทุกฝ่าย", h: "วิสัยทัศน์/นโยบาย/แผน" },
  { t: "1.2 มีระบบประกันคุณภาพภายในสถานศึกษา และมีการนำผลไปใช้พัฒนาอย่างต่อเนื่อง", h: "ระบบประกันคุณภาพภายใน" },
  { t: "1.3 มีโครงสร้างการบริหารที่ชัดเจน ครอบคลุมวิชาการ บุคคล งบประมาณ และงานทั่วไป", h: "โครงสร้างการบริหาร" },
  { t: "1.4 มีระบบนิเทศภายในและการพัฒนาบุคลากรอย่างเป็นระบบและต่อเนื่อง", h: "นิเทศภายใน/พัฒนาบุคลากร" }
];
const D2 = [
  { t: "2.1 สถานศึกษามีหลักสูตรสถานศึกษาสอดคล้องกับบริบทและความต้องการของผู้เรียน", h: "หลักสูตรสถานศึกษา" },
  { t: "2.2 มีการวางแผนการใช้หลักสูตร และจัดทำหน่วยการเรียนรู้อิงมาตรฐานและตัวชี้วัด", h: "หลักสูตร/หน่วยการเรียนรู้" },
  { t: "2.3 มีการวิเคราะห์ผู้เรียนเป็นรายบุคคล และใช้ผลในการออกแบบการจัดการเรียนรู้", h: "วิเคราะห์ผู้เรียนรายบุคคล" },
  { t: "2.4 มีสื่อ นวัตกรรม และแหล่งเรียนรู้ที่เอื้อต่อการใช้หลักสูตร", h: "สื่อ/นวัตกรรม/แหล่งเรียนรู้" }
];
const D3 = [
  { t: "3.1 ผู้เรียนมีส่วนร่วมในการเรียนรู้อย่างกระตือรือร้น ผ่านกิจกรรมที่หลากหลาย", h: "ผู้เรียนมีส่วนร่วม" },
  { t: "3.2 ครูใช้เทคนิควิธีการที่หลากหลาย เหมาะสมกับธรรมชาติรายวิชาและความแตกต่างของผู้เรียน", h: "เทคนิค/วิธีการของครู" },
  { t: "3.3 มีการจัดการเรียนรู้ที่ส่งเสริมให้ผู้เรียนคิดวิเคราะห์ ลงมือปฏิบัติ และสื่อสาร", h: "คิดวิเคราะห์/ปฏิบัติจริง" },
  { t: "3.4 มีการบูรณาการหลักธรรม จริยธรรม และความเป็นพลเมืองดีในวิถีชีวิต", h: "บูรณาการหลักธรรม/คุณธรรม" },
  { t: "3.5 มีสภาพแวดล้อมและบรรยากาศที่เอื้อต่อการเรียนรู้ ปลอดภัยและอบอุ่น", h: "สภาพแวดล้อม/บรรยากาศ" },
  { t: "3.6 มีการนำเทคโนโลยีดิจิทัลมาใช้พัฒนาคุณภาพการจัดการเรียนรู้", h: "เทคโนโลยีดิจิทัล" }
];
const D4 = [
  { t: "4.1 มีการวัดประเมินผลสอดคล้องกับตัวชี้วัดและมาตรฐานของหลักสูตร", h: "วัดประเมินผลสอดคล้องหลักสูตร" },
  { t: "4.2 มีเครื่องมือวัดผลที่หลากหลายและสอดคล้องกับจุดประสงค์การเรียนรู้", h: "เครื่องมือวัดผลหลากหลาย" },
  { t: "4.3 มีการนำผลการประเมินไปพัฒนาผู้เรียนและปรับการจัดการเรียนรู้", h: "นำผลประเมินไปพัฒนา" },
  { t: "4.4 มีการแจ้งผลการเรียนรู้และข้อมูลย้อนกลับแก่ผู้เรียนและผู้ปกครอง", h: "แจ้งผล/ข้อมูลย้อนกลับ" }
];
const D5 = [
  { t: "5.1 ผู้เรียนมีผลสัมฤทธิ์ทางการเรียนตามเป้าหมายของสถานศึกษา", h: "ผลสัมฤทธิ์ทางการเรียน" },
  { t: "5.2 ผู้เรียนมีคุณลักษณะอันพึงประสงค์และสุขภาวะที่ดีตามเกณฑ์", h: "คุณลักษณะอันพึงประสงค์" },
  { t: "5.3 มีหลักฐานเชิงประจักษ์การพัฒนา ผลงาน รางวัล และความภาคภูมิใจ", h: "หลักฐานเชิงประจักษ์" },
  { t: "5.4 ผู้ปกครอง ชุมชน และผู้มีส่วนเกี่ยวข้องพึงพอใจและมีส่วนร่วม", h: "ความพึงพอใจ/การมีส่วนร่วม" }
];
const D6 = [
  { t: "6.1 มีระบบการบริหารจัดการเรียนสามัญควบคู่ศาสนาอิสลามที่ชัดเจน", h: "บริหารหลักสูตรควบคู่ศาสนา" },
  { t: "6.2 มีการจัดตารางเรียนและสัดส่วนวิชาสามัญกับวิชาศาสนาที่เหมาะสม", h: "ตารางเรียน/สัดส่วน" },
  { t: "6.3 มีการนิเทศกำกับติดตามการจัดการเรียนสามัญควบคู่ศาสนาอย่างต่อเนื่อง", h: "นิเทศกำกับสามัญ+ศาสนา" },
  { t: "6.4 มีการส่งเสริมครู วิทยากร และแหล่งเรียนรู้ด้านศาสนาอิสลาม", h: "ส่งเสริมครู/แหล่งเรียนรู้อิสลาม" }
];
const D7 = [
  { t: "7.1 มีการเชื่อมโยงองค์ความรู้ระหว่างวิชาสามัญกับวิชาศาสนาในการจัดการเรียนรู้", h: "เชื่อมโยงสามัญ+ศาสนา" },
  { t: "7.2 มีกิจกรรมที่นำหลักธรรมไปประยุกต์ใช้ในชีวิตประจำวันอย่างเป็นรูปธรรม", h: "ประยุกต์หลักธรรมในชีวิตจริง" },
  { t: "7.3 มีการวัดประเมินผลทั้งสองสาย ให้ผู้เรียนศึกษาต่อและประกอบอาชีพได้", h: "วัดประเมินผลสองสาย" },
  { t: "7.4 มีการสร้างเครือข่ายความร่วมมือด้านสามัญควบคู่ศาสนากับชุมชน/หน่วยงาน", h: "เครือข่ายสามัญควบคู่ศาสนา" }
];
const PART1_GROUPS = [
  { group: "ด้านที่ 1 การบริหารและระบบคุณภาพ", items: D1 },
  { group: "ด้านที่ 2 การนำหลักสูตรไปใช้", items: D2 },
  { group: "ด้านที่ 3 การจัดการเรียนรู้", items: D3 },
  { group: "ด้านที่ 4 การวัดและประเมินผล", items: D4 },
  { group: "ด้านที่ 5 ผลที่เกิดขึ้นกับผู้เรียน", items: D5 }
];
const ALL_PART1 = [].concat(D1, D2, D3, D4, D5).map((x, i) => ({ ...x, n: i + 1 }));
const ALL_PART2 = [].concat(D6, D7).map((x, i) => ({ ...x, n: i + 23 }));
const CLASS3_ITEMS = [
  { t: "ผู้เรียนเข้าใจจุดประสงค์และเป้าหมายของการเรียนรู้", h: "เข้าใจเป้าหมายการเรียนรู้" },
  { t: "ผู้เรียนมีส่วนร่วมในกิจกรรมการเรียนรู้อย่างทั่วถึง", h: "ผู้เรียนมีส่วนร่วมทั่วถึง" },
  { t: "ผู้เรียนได้คิด ลงมือปฏิบัติ และสื่อสารสิ่งที่เรียนรู้", h: "คิด/ลงมือ/สื่อสาร" },
  { t: "กิจกรรมการเรียนรู้สอดคล้องกับบทเรียนและธรรมชาติรายวิชา", h: "กิจกรรมตรงบทเรียน" },
  { t: "ครูตรวจสอบ/สังเกตความเข้าใจผู้เรียนและให้ข้อมูลย้อนกลับ", h: "ตรวจสอบความเข้าใจ/ข้อมูลย้อนกลับ" },
  { t: "มีหลักฐานหรือร่องรอยการเรียนรู้ของผู้เรียนชัดเจน", h: "หลักฐานการเรียนรู้" },
  { t: "ครูใช้คำถามกระตุ้นการคิดและการมีส่วนร่วมของผู้เรียน", h: "คำถามกระตุ้นการคิด" },
  { t: "ครูจัดการชั้นเรียน บรรยากาศ และเวลาได้เหมาะสม", h: "การจัดการชั้นเรียน" }
];
const CHECK4_ITEMS = [
  { t: "สุ่มตรวจการอ่านออกเขียนได้ของผู้เรียนตามช่วงชั้น", h: "การอ่านออกเขียนได้" },
  { t: "สุ่มตรวจการคิดคำนวณและทักษะทางคณิตศาสตร์", h: "การคิดคำนวณ" },
  { t: "สุ่มตรวจทักษะการคิดวิเคราะห์/การแก้ปัญหา/การสื่อสาร", h: "ทักษะการคิด/การสื่อสาร" },
  { t: "สุ่มตรวจคุณลักษณะและพฤติกรรมที่พึงประสงค์", h: "คุณลักษณะที่พึงประสงค์" }
];
const SUPPORT_OPTIONS = [
  "การนิเทศภายในสถานศึกษา", "การพัฒนาครูโดยใช้วิจัยเป็นฐาน", "การอบรมเชิงปฏิบัติการจัดการเรียนรู้เชิงรุก",
  "การพัฒนาสื่อและนวัตกรรมการเรียนรู้", "เครื่องมือวัดและประเมินผลผู้เรียน", "การจัดทำหลักสูตรสถานศึกษา/หลักสูตรท้องถิ่น",
  "การบริหารจัดการชั้นเรียน", "เทคโนโลยีดิจิทัลเพื่อการเรียนรู้", "การสร้างเครือข่ายความร่วมมือระหว่างสถานศึกษา",
  "การนิเทศโดยใช้พี่เลี้ยง (Mentoring)", "การพัฒนาคุณธรรมจริยธรรมและอัตลักษณ์", "การสนับสนุนงบประมาณ/วัสดุอุปกรณ์"
];
const ROUNDS = [
  { v: "รอบที่ 1 (ภาคเรียนที่ 1)", note: "สำรวจสภาพปัจจุบัน กำหนดประเด็นพัฒนา / ตรวจเยี่ยมชั้นเรียน" },
  { v: "รอบที่ 2 (ภาคเรียนที่ 2)", note: "ติดตามผลการเปลี่ยนแปลงจากข้อตกลงครั้งก่อน" }
];
const SUMMARY_Q = [
  "ประเด็นที่เห็นจุดแข็ง/สิ่งที่ทำได้ดีที่สุด คืออะไร",
  "ประเด็นที่ต้องเร่งพัฒนา/เป็นข้อกังวลหลัก คืออะไร",
  "การสนับสนุนที่สถานศึกษาต้องการมากที่สุด คืออะไร",
  "ข้อตกลงร่วมที่จะดำเนินต่อไปจนถึงการนิเทศครั้งหน้า คืออะไร",
  "ข้อเสนอแนะอื่น ๆ ต่อคณะนิเทศหรือหน่วยงานของท่าน"
];

// -------------------------------------------------------------
// Utility
// -------------------------------------------------------------
const $ = s => document.querySelector(s);
const el = id => document.getElementById(id);
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function toast(msg, ok) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "");
  t.className = "toast show " + (ok ? "ok" : "err");
  clearTimeout(t._tm);
  t._tm = setTimeout(() => t.className = "toast", 3200);
}
function getLevel(pct) {
  if (pct >= 80) return "ดีมาก";
  if (pct >= 60) return "ดี";
  if (pct >= 40) return "พอใช้";
  return "ต้องปรับปรุง";
}
function getColor(pct) {
  if (pct >= 80) return "#0f766e";
  if (pct >= 60) return "#2563eb";
  if (pct >= 40) return "#d97706";
  return "#dc2626";
}

// --- Network retry (3 ครั้ง + exponential backoff) ---
async function post(action, payload, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action, payload })
      });
      return await r.json();
    } catch (e) {
      if (i === retries - 1) {
        return { success: false, message: "เชื่อมต่อระบบล้มเหลว โปรดตรวจอินเทอร์เน็ตแล้วลองใหม่ (" + e.message + ")" };
      }
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
}

// --- Image compression (canvas resize + quality 0.7) ---
function compressImage(file, maxW = 1600, quality = 0.7) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/') || file.size < 500 * 1024) { resolve(file); return; }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.width, h = img.height;
      if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      c.toBlob(b => {
        if (b && b.size < file.size) resolve(new File([b], file.name, { type: 'image/jpeg' }));
        else resolve(file);
      }, 'image/jpeg', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

// -------------------------------------------------------------
// สถานะแอป
// -------------------------------------------------------------
let CURRENT_USER = null;
let SCHOOLS = [];
let SELECTED = null;        // ข้อมูลโรงเรียนที่เลือก (จาก getSchoolData)
let SELECTED_COORDS = '';
let MAP = null;
let MAP_MARKER = null;
let TABS = [];              // พาเนลแท็บที่ build ไว้
let scrollItems = [];
let sidebarTouched = false;
let AUTO_SAVE_KEY = 'opec_autosave';
let AUTO_SAVE_INTERVAL = null;
let LAST_SAVE_HASH = '';

// --- Auto-save to localStorage ---
function saveDraft() {
  if (!SELECTED || !CURRENT_USER) return;
  const hash = JSON.stringify(STATE).length + '' + Object.keys(STATE.answers).length;
  if (hash === LAST_SAVE_HASH) return;
  LAST_SAVE_HASH = hash;
  const draft = {
    schoolId: SELECTED.id,
    username: CURRENT_USER.username,
    timestamp: new Date().toISOString(),
    state: STATE
  };
  try { localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(draft)); } catch(e) {}
}
function loadDraft(schoolId) {
  try {
    const raw = localStorage.getItem(AUTO_SAVE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (d.schoolId === schoolId) return d;
  } catch(e) {}
  return null;
}
function clearDraft() {
  try { localStorage.removeItem(AUTO_SAVE_KEY); } catch(e) {}
}
function startAutoSave() {
  if (AUTO_SAVE_INTERVAL) clearInterval(AUTO_SAVE_INTERVAL);
  AUTO_SAVE_INTERVAL = setInterval(saveDraft, 30000);
}
function restoreDraftIfAny() {
  if (!SELECTED) return;
  const draft = loadDraft(SELECTED.id);
  if (!draft || !draft.state) return;
  if (!confirm('พบข้อมูลร่างล่าสุดจาก ' + new Date(draft.timestamp).toLocaleString('th') + '\nต้องการกู้คืนข้อมูลหรือไม่?')) { clearDraft(); return; }
  STATE = draft.state;
  document.querySelectorAll('button.sc[data-key]').forEach(btn => {
    const key = btn.dataset.key;
    if (STATE.answers[key] !== undefined) {
      const v = STATE.answers[key];
      if (v === null) { btn.classList.add('scsel'); }
      else if (Number(btn.dataset.sc) === v) { btn.classList.add('scsel'); }
    }
  });
  document.querySelectorAll('textarea.note[data-key]').forEach(ta => {
    const key = ta.dataset.key;
    if (STATE.notes[key]) ta.value = STATE.notes[key];
  });
  toast('กู้คืนข้อมูลร่างเรียบร้อย', true);
}

const SC0 = { label: '0', hint: 'ต้องได้รับการช่วยเหลือ', cls: 'sc0' };
const SC1 = { label: '1', hint: 'กำลังพัฒนา', cls: 'sc1' };
const SC2 = { label: '2', hint: 'ทำได้ชัดเจน', cls: 'sc2' };
const SNA = { label: 'N/A', hint: 'ไม่เกี่ยวข้อง', cls: 'scna' };
const ALL_SC = [SC0, SC1, SC2, SNA];

// ============================================================
// เข้าสู่ระบบ / สมัครสมาชิก
// ============================================================
const REMEMBER_KEY = "opec_login";

let CAPTCHA_A = 0, CAPTCHA_B = 0, CAPTCHA_OP = '+';
let LOGIN_SCHOOL_ID = '';

function genCaptcha() {
  CAPTCHA_A = Math.floor(Math.random() * 20) + 1;
  CAPTCHA_B = Math.floor(Math.random() * 20) + 1;
  CAPTCHA_OP = Math.random() < 0.5 ? '+' : '-';
  if (CAPTCHA_OP === '-' && CAPTCHA_A < CAPTCHA_B) { const t = CAPTCHA_A; CAPTCHA_A = CAPTCHA_B; CAPTCHA_B = t; }
}
function captchaAnswer() { return CAPTCHA_OP === '+' ? CAPTCHA_A + CAPTCHA_B : CAPTCHA_A - CAPTCHA_B; }
function captchaHtml() {
  genCaptcha();
  return `<label class="captcha-row">验证码: <b>${CAPTCHA_A} ${CAPTCHA_OP} ${CAPTCHA_B} = ?</b>
    <input type="number" id="captchaAns" required placeholder="?" autocomplete="off"></label>`;
}
function checkCaptcha() {
  const v = parseInt($('#captchaAns').value, 10);
  if (v !== captchaAnswer()) { genCaptcha(); return false; }
  return true;
}

function showLogin() {
  LOGIN_SCHOOL_ID = '';
  const app = $('#app');
  app.innerHTML = `
  <div class="login-wrap">
    <div class="login-split">
      <div class="login-box">
        <div class="brand"><div class="brand-ic">🏫</div><div><h1>ระบบนิเทศออนไลน์</h1><p>สถานศึกษาเอกชนในระบบ จังหวัดนราธิวาส</p></div></div>
        <form id="loginForm" onsubmit="return doLogin(event)">
          <div id="loginMsg" class="login-msg"></div>
          <label>Username <input type="text" id="username" autocomplete="username" required></label>
          <label>Password
            <div class="pw-row"><input type="password" id="password" autocomplete="current-password" required>
            <button type="button" class="pw-eye" onclick="togglePw()" id="pwEye">👁</button></div>
          </label>
          <div class="opt-row">
            <label class="chk"><input type="checkbox" id="showPass" onchange="togglePw()"> แสดงรหัสผ่าน</label>
            <label class="chk"><input type="checkbox" id="rememberPass"> จดจำการเข้าสู่ระบบ</label>
          </div>
          <button type="submit" class="btn btn-primary btn-block">เข้าสู่ระบบ</button>
        </form>
        <div class="login-alt">ยังไม่มีบัญชี? <a href="#" onclick="showRegister();return false;">สมัครสมาชิก</a></div>
      </div>
      <div class="login-panel">
        <h2>📊 สถิติสถานศึกษาเอกชน จ.นราธิวาส</h2>
        <div class="ps-stat">
          <div class="ps-stat-card"><div class="ps-stat-num" id="psSchools">-</div><div class="ps-stat-label">สถานศึกษา</div></div>
          <div class="ps-stat-card"><div class="ps-stat-num" id="psEval">-</div><div class="ps-stat-label">ครั้งที่นิเทศ</div></div>
          <div class="ps-stat-card"><div class="ps-stat-num" id="psStaff">-</div><div class="ps-stat-label">ครู/บุคลากร</div></div>
          <div class="ps-stat-card"><div class="ps-stat-num" id="psStudents">-</div><div class="ps-stat-label">นักเรียน</div></div>
        </div>
        <div class="ps-reset"><button type="button" onclick="loginSchoolClear()">↩ ล้างการเลือก</button></div>
        <input type="text" id="psSearch" class="ps-search" placeholder="🔍 พิมพ์ค้นหาโรงเรียน..." oninput="loginSchoolFilter(this.value)">
        <div class="ps-list" id="psList"><div class="loading" style="color:#ccfbf1">กำลังโหลดรายชื่อ...</div></div>
        <div class="ps-count" id="psCount"></div>
      </div>
    </div>
  </div>`;
  restoreSavedLogin();
  loadLoginData();
}

let LOGIN_SCHOOLS = [];
function loginSchoolClear() {
  $('#psSearch').value = '';
  loginSchoolFilter('');
}
function loginSchoolFilter(q) {
  const kw = (q || '').toLowerCase().trim();
  const list = LOGIN_SCHOOLS.filter(s =>
    !kw || (s.name || '').toLowerCase().includes(kw) ||
    (s.dist || '').toLowerCase().includes(kw) ||
    (s.subdist || '').toLowerCase().includes(kw) ||
    (s.form || '').toLowerCase().includes(kw));
  renderLoginSchools(list);
}
function renderLoginSchools(list) {
  const box = $('#psList');
  if (!box) return;
  if (!list.length) { box.innerHTML = `<div class="empty" style="background:transparent;border-color:rgba(255,255,255,.2);color:#a7f3d0">ไม่พบสถานศึกษา</div>`; $('#psCount').textContent = ''; return; }
  box.innerHTML = list.map(s => `
    <div class="ps-item ${s.id === LOGIN_SCHOOL_ID ? 'selected' : ''}" onclick="loginPickSchool('${esc(s.id)}')">
      <div class="ps-item-name"><b>${esc(s.name)}</b><small>${esc(s.dist || '')} ${esc(s.subdist || '')}</small></div>
      <span class="ps-item-form">${esc(s.form || '')}</span>
    </div>`).join('');
  $('#psCount').textContent = 'พบ ' + list.length + ' จาก ' + LOGIN_SCHOOLS.length + ' แห่ง';
}
function loginPickSchool(id) {
  LOGIN_SCHOOL_ID = id;
  const s = LOGIN_SCHOOLS.find(x => x.id === id);
  renderLoginSchoolsFilterKeep();
  toast(s ? ('เลือก: ' + s.name) : 'เลือก: ' + id, true);
}
function renderLoginSchoolsFilterKeep() {
  loginSchoolFilter($('#psSearch').value);
}
async function loadLoginData() {
  // สถิติ
  const st = await post('getStatsPublic');
  if (st && st.success && st.data) {
    const d = st.data;
    const set = (id, v) => { const e = $('#' + id); if (e) e.textContent = v; };
    set('psSchools', d.totalSchools); set('psEval', d.totalEval);
    set('psStaff', d.staff); set('psStudents', d.students);
  }
  // รายชื่อโรงเรียน
  const r = await post('getSchoolListPublic');
  if (r && r.success && r.data) {
    LOGIN_SCHOOLS = r.data.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    renderLoginSchools(LOGIN_SCHOOLS);
  } else {
    const box = $('#psList');
    if (box) box.innerHTML = `<div class="empty" style="background:transparent;border-color:rgba(255,255,255,.2);color:#a7f3d0">${esc((r||{}).message || 'ไม่สามารถโหลดรายชื่อได้')}</div>`;
  }
}

function restoreSavedLogin() {
  try {
    const s = JSON.parse(localStorage.getItem(REMEMBER_KEY) || 'null');
    if (s && s.u) { $('#username').value = s.u; $('#password').value = s.p || ''; $('#rememberPass').checked = true; }
  } catch (e) {}
}

function togglePw() {
  const p = $('#password');
  const isShow = $('#showPass') ? $('#showPass').checked : false;
  p.type = isShow ? 'text' : 'password';
  const eye = $('#pwEye');
  if (eye) eye.textContent = isShow ? '🙈' : '👁';
}

function showRegister() {
  genCaptcha();
  const app = $('#app');
  app.innerHTML = `
  <div class="login-wrap">
    <div class="login-box">
      <div class="brand"><div class="brand-ic">🏫</div><div><h1>สมัครสมาชิก</h1><p>ระบบนิเทศออนไลน์ สถานศึกษาเอกชนในระบบ</p></div></div>
      <form id="regForm" onsubmit="return doRegister(event)">
        <label>Username <input type="text" id="rUser" required></label>
        <label>Password <input type="password" id="rPass" required></label>
        <label>ชื่อ-นามสกุล <input type="text" id="rName" required></label>
        <label>เบอร์โทร <input type="tel" id="rTel"></label>
        ${captchaHtml()}
        <div id="regMsg" class="login-msg"></div>
        <button type="submit" class="btn btn-primary btn-block">สมัครสมาชิก</button>
      </form>
      <div class="login-alt">มีบัญชีแล้ว? <a href="#" onclick="showLogin();return false;">กลับไปเข้าสู่ระบบ</a></div>
    </div>
  </div>`;
}

async function doLogin(e) {
  e.preventDefault();
  const u = $('#username').value.trim();
  const p = $('#password').value;
  const msg = $('#loginMsg');
  msg.className = 'login-msg err';
  msg.textContent = 'กำลังตรวจสอบข้อมูล...';
  const r = await post('login', { username: u, password: p });
  if (r && r.success) {
    CURRENT_USER = r.userData;
    if ($('#rememberPass') && $('#rememberPass').checked) {
      localStorage.setItem(REMEMBER_KEY, JSON.stringify({ u, p }));
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
    msg.className = 'login-msg ok';
    msg.textContent = 'เข้าสู่ระบบสำเร็จ! กำลังโหลดระบบ...';
    if (LOGIN_SCHOOL_ID) {
      startDashWithSchool(LOGIN_SCHOOL_ID);
    } else {
      startDash();
    }
  } else {
    msg.className = 'login-msg err';
    msg.textContent = (r && r.message) || 'เข้าสู่ระบบไม่สำเร็จ';
  }
  return false;
}

async function doRegister(e) {
  e.preventDefault();
  if (!checkCaptcha()) {
    genCaptcha();
    const msg = $('#regMsg');
    msg.className = 'login-msg err';
    msg.textContent = 'รหัสตรวจสอบไม่ถูกต้อง กรุณาลองใหม่';
    const cap = document.querySelector('.captcha-row b');
    if (cap) cap.textContent = `${CAPTCHA_A} ${CAPTCHA_OP} ${CAPTCHA_B} = ?`;
    return false;
  }
  const msg = $('#regMsg');
  msg.className = 'login-msg';
  msg.textContent = 'กำลังส่งข้อมูล...';
  const r = await post('register', {
    username: $('#rUser').value.trim(),
    password: $('#rPass').value,
    fname: $('#rName').value.trim(),
    tel: $('#rTel').value.trim()
  });
  msg.className = r && r.success ? 'login-msg ok' : 'login-msg err';
  msg.textContent = (r && r.message) || '';
  if (r && r.success) {
    genCaptcha();
    const cap = document.querySelector('.captcha-row b');
    if (cap) cap.textContent = `${CAPTCHA_A} ${CAPTCHA_OP} ${CAPTCHA_B} = ?`;
  }
  return false;
}

function logout() {
  CURRENT_USER = null;
  SCHOOLS = []; SELECTED = null; STATE = { answers: {}, notes: {}, multibasic: {}, multiVals: {}, basic: {} };
  if (AUTO_SAVE_INTERVAL) clearInterval(AUTO_SAVE_INTERVAL);
  localStorage.removeItem(REMEMBER_KEY);
  clearDraft();
  showLogin();
}

// ============================================================
// หน้าหลัก / Dashboard
// ============================================================
async function startDash() {
  const app = $('#app');
  app.innerHTML = `
  <div class="topbar">
    <div style="display:flex;align-items:center;gap:8px">
      <button class="hamburger" onclick="toggleSidebar()" id="hamburgerBtn">☰</button>
      <div class="tb-brand">🏫 <b>${APP_NAME}</b></div>
    </div>
    <div class="tb-user">${esc(CURRENT_USER ? CURRENT_USER.fname : '')} <small class="role">${esc(CURRENT_USER ? CURRENT_USER.role : '')}</small>
      <button class="btn btn-mini" onclick="logout()">ออกจากระบบ</button>
    </div>
  </div>
  <div class="main">
    <aside class="side" id="sidebar">
      <div class="side-close"><button onclick="toggleSidebar()">✕ ปิด</button></div>
      <div class="side-card">
        <h4>เลือกสถานศึกษา</h4>
        <select id="schoolSelect" onchange="loadSchool(this.value)"><option value="">— เลือกสถานศึกษา —</option></select>
        <div id="pinCard"></div>
        <div class="side-actions">
          <button class="btn" onclick="saveResult()">💾 บันทึกผลการนิเทศ</button>
          <button class="btn" onclick="printReport()" style="margin-top:6px">🖨️ พิมพ์/Export PDF</button>
        </div>
      </div>
      <div class="nav">
        <button class="tb-nav tab-btn active" data-target="tab-1" onclick="switchTab('tab-1')">📁 ข้อมูลพื้นฐาน</button>
        <button class="tb-nav tab-btn" data-target="tab-2" onclick="switchTab('tab-2')">🏛️ บริหาร/ระบบคุณภาพ</button>
        <button class="tb-nav tab-btn" data-target="tab-3" onclick="switchTab('tab-3')">📚 หลักสูตร/จัดการเรียนรู้</button>
        <button class="tb-nav tab-btn" data-target="tab-4" onclick="switchTab('tab-4')">📊 วัดผล/ผลผู้เรียน</button>
        <button class="tb-nav tab-btn" data-target="tab-5" onclick="switchTab('tab-5')">🧐 ตรวจเยี่ยมชั้นเรียน</button>
        <button class="tb-nav tab-btn" data-target="tab-6" onclick="switchTab('tab-6')">🔧 สะท้อนผล/แผนพัฒนา</button>
        <button class="tb-nav tab-btn" data-target="tab-7" onclick="switchTab('tab-7')">✅ ติดตาม/สรุป</button>
        <button class="tb-nav tab-btn" data-target="tab-files" onclick="showUploadsPanel()">📎 ไฟล์/หลักฐาน</button>
        <div class="nav-sep"></div>
        <button class="tb-nav tab-btn" data-target="tab-hist" onclick="showEvalHistory()">📜 ประวัติการนิเทศ</button>
        <button class="tb-nav tab-btn" data-target="tab-stats" onclick="showStatsPanel()">📊 สถิติระบบ</button>
        ${CURRENT_USER && CURRENT_USER.role === 'ผู้ดูแลระบบ' ? `<button class="tb-nav tab-btn" data-target="tab-users" onclick="showUsersPanel()">👥 จัดการผู้ใช้</button>` : ''}
        <button class="tb-nav tab-btn" data-target="tab-info" onclick="showInfo()">ℹ️ วิธีใช้</button>
      </div>
    </aside>
    <section class="content">
      <div id="scoreBar"></div>
      <div class="panels">
        <div id="tab-1" class="panel active"></div>
        <div id="tab-2" class="panel"></div>
        <div id="tab-3" class="panel"></div>
        <div id="tab-4" class="panel"></div>
        <div id="tab-5" class="panel"></div>
        <div id="tab-6" class="panel"></div>
        <div id="tab-7" class="panel"></div>
        <div id="tab-files" class="panel"><div id="filesWrap"></div></div>
        <div id="tab-hist" class="panel"><div id="histWrap"></div></div>
        <div id="tab-stats" class="panel"><div id="statsWrap"></div></div>
        <div id="tab-users" class="panel"><div id="usersWrap"></div></div>
        <div id="tab-info" class="panel"><div id="infoWrap"></div></div>
      </div>
    </section>
  </div>
  <div id="toast" class="toast"></div>`;

  const r = await post('getSchoolList');
  if (r && r.success) {
    SCHOOLS = (r.data || []).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    const sel = $('#schoolSelect');
    sel.innerHTML = '<option value="">— เลือกสถานศึกษา —</option>' + SCHOOLS.map(s => `<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('');
    if (!SCHOOLS.length) $('#pinCard').innerHTML = `<div class="empty">ยังไม่มีข้อมูลสถานศึกษาในระบบ <br>ผู้ดูแลสามารถพิมพ์ข้อมูลลงชีต ADDR_SCHOOL (แถวที่ 6 เป็นต้นไป)</div>`;
  } else {
    $('#pinCard').innerHTML = `<div class="empty">${esc((r||{}).message || 'ไม่สามารถโหลดรายชื่อโรงเรียนได้')}</div>`;
  }

  // แสดง Dashboard หน้าแรก
  showDashboard();
  $('#toast').className = 'toast';
}

// ============================================================
// เข้าสู่ระบบแล้วเปิดโรงเรียนที่เลือกจากหน้า Login ทันที
// ============================================================
async function startDashWithSchool(schoolId) {
  const app = $('#app');
  app.innerHTML = `
  <div class="topbar">
    <div style="display:flex;align-items:center;gap:8px">
      <button class="hamburger" onclick="toggleSidebar()" id="hamburgerBtn">☰</button>
      <div class="tb-brand">🏫 <b>${APP_NAME}</b></div>
    </div>
    <div class="tb-user">${esc(CURRENT_USER ? CURRENT_USER.fname : '')} <small class="role">${esc(CURRENT_USER ? CURRENT_USER.role : '')}</small>
      <button class="btn btn-mini" onclick="logout()">ออกจากระบบ</button>
    </div>
  </div>
  <div class="main">
    <aside class="side" id="sidebar">
      <div class="side-close"><button onclick="toggleSidebar()">✕ ปิด</button></div>
      <div class="side-card">
        <h4>เลือกสถานศึกษา</h4>
        <select id="schoolSelect" onchange="loadSchool(this.value)"><option value="">— เลือกสถานศึกษา —</option></select>
        <div id="pinCard"></div>
        <div class="side-actions">
          <button class="btn" onclick="saveResult()">💾 บันทึกผลการนิเทศ</button>
          <button class="btn" onclick="printReport()" style="margin-top:6px">🖨️ พิมพ์/Export PDF</button>
        </div>
      </div>
      <div class="nav">
        <button class="tb-nav tab-btn active" data-target="tab-1" onclick="switchTab('tab-1')">📁 ข้อมูลพื้นฐาน</button>
        <button class="tb-nav tab-btn" data-target="tab-2" onclick="switchTab('tab-2')">🏛️ บริหาร/ระบบคุณภาพ</button>
        <button class="tb-nav tab-btn" data-target="tab-3" onclick="switchTab('tab-3')">📚 หลักสูตร/จัดการเรียนรู้</button>
        <button class="tb-nav tab-btn" data-target="tab-4" onclick="switchTab('tab-4')">📊 วัดผล/ผลผู้เรียน</button>
        <button class="tb-nav tab-btn" data-target="tab-5" onclick="switchTab('tab-5')">🧐 ตรวจเยี่ยมชั้นเรียน</button>
        <button class="tb-nav tab-btn" data-target="tab-6" onclick="switchTab('tab-6')">🔧 สะท้อนผล/แผนพัฒนา</button>
        <button class="tb-nav tab-btn" data-target="tab-7" onclick="switchTab('tab-7')">✅ ติดตาม/สรุป</button>
        <button class="tb-nav tab-btn" data-target="tab-files" onclick="showUploadsPanel()">📎 ไฟล์/หลักฐาน</button>
        <div class="nav-sep"></div>
        <button class="tb-nav tab-btn" data-target="tab-hist" onclick="showEvalHistory()">📜 ประวัติการนิเทศ</button>
        <button class="tb-nav tab-btn" data-target="tab-stats" onclick="showStatsPanel()">📊 สถิติระบบ</button>
        ${CURRENT_USER && CURRENT_USER.role === 'ผู้ดูแลระบบ' ? `<button class="tb-nav tab-btn" data-target="tab-users" onclick="showUsersPanel()">👥 จัดการผู้ใช้</button>` : ''}
        <button class="tb-nav tab-btn" data-target="tab-info" onclick="showInfo()">ℹ️ วิธีใช้</button>
      </div>
    </aside>
    <section class="content">
      <div id="scoreBar"></div>
      <div class="panels">
        <div id="tab-1" class="panel active"></div>
        <div id="tab-2" class="panel"></div>
        <div id="tab-3" class="panel"></div>
        <div id="tab-4" class="panel"></div>
        <div id="tab-5" class="panel"></div>
        <div id="tab-6" class="panel"></div>
        <div id="tab-7" class="panel"></div>
        <div id="tab-files" class="panel"><div id="filesWrap"></div></div>
        <div id="tab-hist" class="panel"><div id="histWrap"></div></div>
        <div id="tab-stats" class="panel"><div id="statsWrap"></div></div>
        <div id="tab-users" class="panel"><div id="usersWrap"></div></div>
        <div id="tab-info" class="panel"><div id="infoWrap"></div></div>
      </div>
    </section>
  </div>
  <div id="toast" class="toast"></div>`;

  const r = await post('getSchoolList');
  if (r && r.success) {
    SCHOOLS = (r.data || []).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    const sel = $('#schoolSelect');
    sel.innerHTML = '<option value="">— เลือกสถานศึกษา —</option>' + SCHOOLS.map(s => `<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('');
    if (!SCHOOLS.length) $('#pinCard').innerHTML = `<div class="empty">ยังไม่มีข้อมูลสถานศึกษาในระบบ</div>`;
  } else {
    $('#pinCard').innerHTML = `<div class="empty">${esc((r||{}).message || 'ไม่สามารถโหลดรายชื่อโรงเรียนได้')}</div>`;
  }

  // เลือกโรงเรียนที่เลือกจากหน้า Login ทันที
  const sel = $('#schoolSelect');
  if (sel && schoolId) {
    sel.value = schoolId;
    loadSchool(schoolId);
  } else {
    showDashboard();
  }
  $('#toast').className = 'toast';
}

// ============================================================
// Dashboard หน้าแรก (แสดงหลังเข้าสู่ระบบ)
// ============================================================
async function showDashboard() {
  // โหลดสถิติ
  const stats = await post('getStatsSchool');
  const d = (stats && stats.success) ? stats.data : { totalSchools: 0, totalEval: 0, totalUsers: 0, staff: 0, students: 0, avgPct: 0, levelCounts: {}, latest: [] };

  // ดึงข้อมูลร่างล่าสุด
  let draftInfo = null;
  try {
    const raw = localStorage.getItem(AUTO_SAVE_KEY);
    if (raw) {
      const draft = JSON.parse(raw);
      if (draft.schoolId && draft.timestamp) {
        const school = SCHOOLS.find(s => s.id === draft.schoolId);
        draftInfo = { school: school ? school.name : draft.schoolId, time: new Date(draft.timestamp).toLocaleString('th') };
      }
    }
  } catch(e) {}

  const root = el('tab-1');
  root.innerHTML = `
    <div class="dash-hero">
      <div class="dash-hero-text">
        <h1>👋 สวัสดี ${esc(CURRENT_USER ? CURRENT_USER.fname : '')}</h1>
        <p>ยินดีต้อนรับสู่ระบบนิเทศออนไลน์ สถานศึกษาเอกชนในระบบ จ.นราธิวาส</p>
      </div>
      <button class="btn-start" onclick="startInspection()">
        <span class="btn-start-icon">🚀</span>
        <span class="btn-start-text">เริ่มการนิเทศ</span>
        <span class="btn-start-sub">เลือกสถานศึกษาและเริ่มปฏิบัติงานภาคสนาม</span>
      </button>
    </div>

    ${draftInfo ? `
    <div class="dash-draft" onclick="resumeDraft('${esc(draftInfo.school)}')">
      <span>📝</span>
      <div><b>พบข้อมูลร่างล่าสุด</b><small>${esc(draftInfo.school)} · ${draftInfo.time}</small></div>
      <span class="btn btn-mini">กู้คืน →</span>
    </div>` : ''}

    <div class="dash-stats">
      <div class="dash-stat-card" onclick="startInspection()">
        <div class="dash-stat-icon">🏫</div>
        <div class="dash-stat-num">${d.totalSchools}</div>
        <div class="dash-stat-label">สถานศึกษาทั้งหมด</div>
      </div>
      <div class="dash-stat-card" onclick="showEvalHistory()">
        <div class="dash-stat-icon">📋</div>
        <div class="dash-stat-num">${d.totalEval}</div>
        <div class="dash-stat-label">ครั้งที่นิเทศแล้ว</div>
      </div>
      <div class="dash-stat-card">
        <div class="dash-stat-icon">👨‍🏫</div>
        <div class="dash-stat-num">${d.staff}</div>
        <div class="dash-stat-label">ครู/บุคลากร</div>
      </div>
      <div class="dash-stat-card">
        <div class="dash-stat-icon">🎓</div>
        <div class="dash-stat-num">${d.students}</div>
        <div class="dash-stat-label">นักเรียน</div>
      </div>
    </div>

    <div class="dash-section">
      <h3>📊 สถิติการนิเทศ</h3>
      <div class="dash-levels">
        <div class="dash-level-item"><span class="dl-dot" style="background:#0f766e"></span>ดีมาก (≥80%) <b>${d.levelCounts['ดีมาก'] || 0}</b></div>
        <div class="dash-level-item"><span class="dl-dot" style="background:#2563eb"></span>ดี (60-79%) <b>${d.levelCounts['ดี'] || 0}</b></div>
        <div class="dash-level-item"><span class="dl-dot" style="background:#d97706"></span>พอใช้ (40-59%) <b>${d.levelCounts['พอใช้'] || 0}</b></div>
        <div class="dash-level-item"><span class="dl-dot" style="background:#dc2626"></span>ต้องปรับปรุง (<40%) <b>${d.levelCounts['ต้องปรับปรุง'] || 0}</b></div>
      </div>
      <div class="dash-avg">ค่าเฉลี่ยร้อยละ: <b style="color:${getColor(d.avgPct)}">${d.avgPct}%</b></div>
    </div>

    <div class="dash-section">
      <h3>📜 การนิเทศล่าสุด</h3>
      ${d.latest.length ? d.latest.slice(0, 5).map(v => `
        <div class="dash-recent">
          <div class="dash-recent-info">
            <b>${esc(v.name)}</b>
            <small>${esc(v.form || '')} · ${esc(v.timestamp)}</small>
          </div>
          <div class="dash-recent-score">
            <span class="chip" style="background:${getColor(v.pct)};font-size:12px">${v.pct}% ${esc(v.level)}</span>
          </div>
        </div>
      `).join('') : '<div class="empty">ยังไม่มีประวัติการนิเทศ</div>'}
    </div>

    <div class="dash-section">
      <h3>🏫 รายชื่อสถานศึกษา (${SCHOOLS.length} แห่ง)</h3>
      <div class="dash-school-list">
        ${SCHOOLS.slice(0, 10).map(s => `
          <div class="dash-school-item" onclick="startInspectionSchool('${esc(s.id)}')">
            <div class="dash-school-info">
              <b>${esc(s.name)}</b>
              <small>${esc(s.dist || '')} · ${esc(s.form || '')}</small>
            </div>
            <span class="btn btn-mini">เปิด →</span>
          </div>
        `).join('')}
        ${SCHOOLS.length > 10 ? `<div class="dash-more">และอีก ${SCHOOLS.length - 10} แห่ง... <a href="#" onclick="startInspection();return false;">ดูทั้งหมด</a></div>` : ''}
      </div>
    </div>
  `;
}

// ============================================================
// เริ่มการนิเทศ (เลือกสถานศึกษา)
// ============================================================
function startInspection() {
  // แสดง dropdown เลือกสถานศึกษาแบบเต็มหน้าจอ
  const root = el('tab-1');
  root.innerHTML = `
    <div class="dash-hero">
      <div class="dash-hero-text">
        <h1>🚀 เริ่มการนิเทศ</h1>
        <p>เลือกสถานศึกษาที่ต้องการเข้าปฏิบัติงานภาคสนาม</p>
      </div>
    </div>
    <div class="dash-section">
      <div class="school-pick-grid">
        ${SCHOOLS.map(s => `
          <div class="school-pick-card" onclick="pickSchool('${esc(s.id)}')">
            <div class="school-pick-icon">🏫</div>
            <div class="school-pick-name">${esc(s.name)}</div>
            <div class="school-pick-dist">${esc(s.dist || '-')} · ${esc(s.subdist || '-')}</div>
            <div class="school-pick-form">${esc(s.form || '-')}</div>
          </div>
        `).join('')}
        ${!SCHOOLS.length ? '<div class="empty">ยังไม่มีข้อมูลสถานศึกษาในระบบ</div>' : ''}
      </div>
    </div>
  `;
  // sync sidebar dropdown
  const sel = $('#schoolSelect');
  if (sel) sel.value = '';
}

function startInspectionSchool(id) {
  const sel = $('#schoolSelect');
  if (sel) sel.value = id;
  loadSchool(id);
}

function pickSchool(id) {
  startInspectionSchool(id);
}

function resumeDraft(schoolName) {
  // ค้นหา school จากชื่อแล้วเปิด
  const s = SCHOOLS.find(x => x.name === schoolName || x.id === schoolName);
  if (s) pickSchool(s.id);
  else startInspection();
}

async function loadSchool(id) {
  if (!id) { SELECTED = null; return; }
  const r = await post('getSchoolData', id);
  if (!r || !r.success) { toast((r||{}).message || 'โหลดข้อมูลไม่สำเร็จ', false); return; }
  SELECTED = r.data;
  SCHOOLS = SCHOOLS.map(s => s.id === SELECTED.id ? { ...s, ...r.data } : s);
  STATE = { answers: {}, notes: {}, multibasic: {}, multiVals: {}, basic: {} };
  buildAll();
  switchTab('tab-1');
  startAutoSave();
  restoreDraftIfAny();
  toast('เลือก ' + SELECTED.name + ' แล้ว', true);
}

// -------- แผนที่ (Leaflet + GPS) --------
function initPinBar() {
  const card = $('#pinCard');
  if (!card) return;
  card.innerHTML = `<div class="pin-head"><b>📍 ที่ตั้งสถานศึกษา</b>
    <button type="button" class="btn btn-mini" id="gpsBtn">📌 หาพิกัดปัจจุบัน</button></div>
    <div id="map" class="map"></div>
    <div class="pin-coords"><input id="coords" placeholder="ละติจูด, ลองจิจูด" value="${esc(SELECTED_COORDS || '')}">
    <button type="button" class="btn btn-mini" id="setPin">บันทึกพิกัด</button></div>`;
  if (typeof L === 'undefined') {
    card.innerHTML = '<div class="empty">แผนที่โหลดไม่พร้อม (Leaflet)</div>';
    return;
  }
  if (!MAP) {
    MAP = L.map('map').setView([6.4246, 101.8249], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '&copy; OpenStreetMap'
    }).addTo(MAP);
    // ชั้นดาวเทียมเพิ่มเติม
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19, className: 'satellite-layer'
    }).addTo(MAP);
  }
  setTimeout(() => MAP.invalidateSize(), 300);
  const c = SELECTED_COORDS || SELECTED.coords || '';
  if (c) {
    const [lat, lng] = c.split(',').map(parseFloat);
    if (!isNaN(lat) && !isNaN(lng)) {
      if (MAP_MARKER) MAP_MARKER.setLatLng([lat, lng]); else MAP_MARKER = L.marker([lat, lng]).addTo(MAP);
      MAP.setView([lat, lng], 15);
    }
  }
  $('#gpsBtn').onclick = async () => {
    if (!navigator.geolocation) { toast('อุปกรณ์ไม่รองรับ GPS', false); return;
      toast('กำลังค้นหาพิกัด... (อาจใช้เวลา 15-30 วินาที)', false);
    }
    navigator.geolocation.getCurrentPosition(p => {
      const lat = p.coords.latitude.toFixed(6), lng = p.coords.longitude.toFixed(6);
      $('#coords').value = lat + ', ' + lng;
      if (MAP_MARKER) MAP_MARKER.setLatLng([lat, lng]); else MAP_MARKER = L.marker([lat, lng]).addTo(MAP);
      MAP.setView([lat, lng], 15);
      toast('ได้พิกัดจาก GPS แล้ว (' + lat + ', ' + lng + ')', true);
    }, (err) => {
      toast('GPS ไม่สำเร็จ: ' + (err.code === 2 ? 'ไม่พบสัญญาณ GPS' : err.code === 3 ? 'หมดเวลาค้นหา' : 'กรุณาพิมพ์พิกัดเอง') + ' — ลองคลิกบนแผนที่', false);
    }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 });
  };
  MAP.on('click', e => {
    const lat = e.latlng.lat.toFixed(6), lng = e.latlng.lng.toFixed(6);
    $('#coords').value = lat + ', ' + lng;
    if (MAP_MARKER) MAP_MARKER.setLatLng(e.latlng); else MAP_MARKER = L.marker(e.latlng).addTo(MAP);
  });
  $('#setPin').onclick = async () => {
    const v = $('#coords').value.trim();
    if (!v) { toast('กรุณาระบุพิกัด', false); return; }
    const r = await post('saveSchoolPin', { id: SELECTED.id, coords: v });
    if (r && r.success) { SELECTED_COORDS = v; SELECTED.coords = v; toast(r.message, true); }
    else toast((r||{}).message || 'บันทึกไม่สำเร็จ', false);
  };
}

// boot
document.addEventListener('DOMContentLoaded', () => {
  if (API_URL === 'APPS_SCRIPT_API_URL') {
    toast('ยังไม่ได้กำหนด URL ของระบบ (ติดต่อผู้ดูแล)', false);
  }
  showLogin();
});

// --- Sidebar toggle สำหรับมือถือ ---
function toggleSidebar() {
  const sb = $('#sidebar');
  if (sb) sb.classList.toggle('open');
}

// --- Print / PDF export ---
function printReport() {
  window.print();
}