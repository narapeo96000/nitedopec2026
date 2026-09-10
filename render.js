// รายงานกลุ่มถัดไปจะไม่แสดงแท็บเติมจนกว่าผู้ใช้จะเลือกประเมินเป็น "1" หรือ "2"
// renderKeyvals — ใช้จริงใน buildTab1/3/4/7 (tabs.js เรียก 5 จุด)
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