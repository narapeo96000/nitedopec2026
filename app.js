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
async function post(action, payload) {
  try {
    const r = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, payload })
    });
    return await r.json();
  } catch (e) {
    return { success: false, message: "เชื่อมต่อระบบล้มเหลว โปรดตรวจอินเทอร์เน็ตแล้วลองใหม่ (" + e.message + ")" };
  }
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

const SC0 = { label: '0', hint: 'ต้องได้รับการช่วยเหลือ', cls: 'sc0' };
const SC1 = { label: '1', hint: 'กำลังพัฒนา', cls: 'sc1' };
const SC2 = { label: '2', hint: 'ทำได้ชัดเจน', cls: 'sc2' };
const SNA = { label: 'N/A', hint: 'ไม่เกี่ยวข้อง', cls: 'scna' };
const ALL_SC = [SC0, SC1, SC2, SNA];

// ============================================================
// เข้าสู่ระบบ / สมัครสมาชิก
// ============================================================
const REMEMBER_KEY = "opec_login";

function showLogin() {
  const app = $('#app');
  app.innerHTML = `
  <div class="login-wrap">
    <div class="login-box">
      <div class="brand"><div class="brand-ic">🏫</div><div><h1>ระบบนิเทศออนไลน์</h1><p>สถานศึกษาเอกชนในระบบ จังหวัดนราธิวาส</p></div></div>
      <form id="loginForm" onsubmit="return doLogin(event)">
        <label>Username <input type="text" id="username" autocomplete="username" required></label>
        <label>Password
          <div class="pw-row"><input type="password" id="password" autocomplete="current-password" required>
          <button type="button" class="pw-eye" onclick="togglePw()" id="pwEye">👁</button></div>
        </label>
        <div class="opt-row">
          <label class="chk"><input type="checkbox" id="showPass" onchange="togglePw()"> แสดงรหัสผ่าน</label>
          <label class="chk"><input type="checkbox" id="rememberPass"> จดจำการเข้าสู่ระบบ</label>
        </div>
        <div id="loginMsg" class="login-msg"></div>
        <button type="submit" class="btn btn-primary btn-block">เข้าสู่ระบบ</button>
      </form>
      <div class="login-alt">ยังไม่มีบัญชี? <a href="#" onclick="showRegister();return false;">สมัครสมาชิก</a></div>
    </div>
  </div>`;
  restoreSavedLogin();
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
    startDash();
  } else {
    msg.className = 'login-msg err';
    msg.textContent = (r && r.message) || 'เข้าสู่ระบบไม่สำเร็จ';
  }
  return false;
}

async function doRegister(e) {
  e.preventDefault();
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
  return false;
}

function logout() {
  CURRENT_USER = null;
  SCHOOLS = []; SELECTED = null; STATE = { answers: {}, notes: {}, multibasic: {}, multiVals: {}, basic: {} };
  localStorage.removeItem(REMEMBER_KEY);
  showLogin();
}

// ============================================================
// หน้าหลัก / Dashboard
// ============================================================
async function startDash() {
  const app = $('#app');
  app.innerHTML = `
  <div class="topbar">
    <div class="tb-brand">🏫 <b>${APP_NAME}</b></div>
    <div class="tb-user">${esc(CURRENT_USER ? CURRENT_USER.fname : '')} <small class="role">${esc(CURRENT_USER ? CURRENT_USER.role : '')}</small>
      <button class="btn btn-mini" onclick="logout()">ออกจากระบบ</button>
    </div>
  </div>
  <div class="main">
    <aside class="side">
      <div class="side-card">
        <h4>เลือกสถานศึกษา</h4>
        <select id="schoolSelect" onchange="loadSchool(this.value)"><option value="">— เลือกสถานศึกษา —</option></select>
        <div id="pinCard"></div>
        <div class="side-actions">
          <button class="btn" onclick="saveResult()">💾 บันทึกผลการนิเทศ</button>
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
  el('tab-1').innerHTML = `<div class="panel-head"><h2>ยินดีต้อนรับสู่ระบบ</h2></div>
    <div class="empty big">เลือกสถานศึกษาแล้วกดปุ่ม "📂 เลือกดูข้อมูล" ด้านซ้าย เพื่อเริ่มการนิเทศ<br><small>ตามแผนการนิเทศ ติดตาม และตรวจเยี่ยมชั้นเรียนโรงเรียนเอกชนในระบบ จ.นราธิวาส (ปีละ 2 ครั้ง)</small></div>`;
  $('#toast').className = 'toast';
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
    if (!navigator.geolocation) { toast('อุปกรณ์ไม่รองรับ GPS', false); return; }
    navigator.geolocation.getCurrentPosition(p => {
      const lat = p.coords.latitude.toFixed(6), lng = p.coords.longitude.toFixed(6);
      $('#coords').value = lat + ', ' + lng;
      if (MAP_MARKER) MAP_MARKER.setLatLng([lat, lng]); else MAP_MARKER = L.marker([lat, lng]).addTo(MAP);
      MAP.setView([lat, lng], 15);
      toast('ได้พิกัดจาก GPS แล้ว', true);
    }, () => toast('ไม่สามารถระบุพิกัดได้', false), { enableHighAccuracy: true, timeout: 8000 });
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