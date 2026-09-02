# ============================================================
#  crud_test.ps1 - ทดสอบ CRUD ระบบนิเทศโรงเรียนเอกชนกับชีตจริง
#  วิธีใช้: powershell -ExecutionPolicy Bypass -File crud_test.ps1
#  (จะสร้างข้อมูลทดสอบ -> แก้ไข -> ลบทิ้ง จนชีตกลับสู่ baseline)
# ============================================================
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$API = 'https://script.google.com/macros/s/AKfycbzOIsAXOkPAL44dOA8KFxZE7WI3TCtS0ceyswLovl3xpzIfZn6O3wr8lou7FLeHw4Ym3Q/exec'
$ADMIN_USER = 'admin'
$ADMIN_PASS = 'admin123'

function Post($o) {
  $json = $o | ConvertTo-Json -Depth 8
  Invoke-RestMethod -Uri $API -Method Post `
    -Body ([System.Text.Encoding]::UTF8.GetBytes($json)) `
    -ContentType 'text/plain;charset=utf-8' -TimeoutSec 120
}
function Log($m) { Write-Host ("  " + $m) }

Write-Host "=== [0] BASELINE ===" -ForegroundColor Cyan
$stats = Post @{ action = 'getStatsSchool' }
$baseline = [int]$stats.data.totalEval
Log "totalEval=$baseline totalSchools=$($stats.data.totalSchools)"

Write-Host "=== [1] READ: getSchoolList + getSchoolData ===" -ForegroundColor Cyan
$list = Post @{ action = 'getSchoolList' }
if ($list.data.Count -eq 0) { Write-Host "!! ไม่มีข้อมูลโรงเรียนในระบบ — ทดสอบได้เฉพาะ login/getStats" -ForegroundColor Yellow }
else {
  $c = $list.data[0]
  Log "list=$($list.data.Count) schools | first id=$($c.id) name=$($c.name)"
  $d = Post @{ action = 'getSchoolData'; payload = @{ id = [string]$c.id } }
  $t = $d.data
  if (-not $t) { throw "getSchoolData failed" }
  Log "data row=$($t.row) form=$($t.form) dist=$($t.dist) staff=$($t.staff) students=$($t.students)"

  $sch = @{
    row      = [int]$t.row; id = [string]$t.id; name = [string]$t.name
    address  = [string]$t.address; dist = [string]$t.dist; subdist = [string]$t.subdist
    phone    = [string]$t.phone; form = [string]$t.form; admin = [string]$t.admin
    staff    = [string]$t.staff; students = [string]$t.students
  }

  # เคลียร์ขยะจากรอบทดสอบก่อนหน้า (ถ้ามี)
  Write-Host "=== [2] CLEANUP stray rows (จากรอบก่อน) ===" -ForegroundColor Cyan
  $h0 = Post @{ action = 'getSchoolEvaluations'; payload = [string]$c.id }
  $stray = @($h0.data)
  if ($stray.Count -gt 0) {
    $lg = Post @{ action = 'login'; payload = @{ username = $ADMIN_USER; password = $ADMIN_PASS } }
    if ($lg.success -and $lg.userData.role -eq 'ผู้ดูแลระบบ') {
      foreach ($r in ($stray | Sort-Object { [int]$_.row } -Descending)) {
        $del = Post @{ action = 'deleteSchoolEvaluation'; payload = @{ admin = $ADMIN_USER; row = [int]$r.row } }
        Log "deleted row $($r.row): $($del.success)"
      }
    } else {
      Write-Host "  !! login admin ไม่สำเร็จ - ลบขยะเองไม่ได้" -ForegroundColor Yellow
    }
  }

  Write-Host "=== [3] CREATE (ส่วนที่1=30/44=68% = ดี) ===" -ForegroundColor Cyan
  $eval = @{
    formType = 'แบบสอนสามัญควบคู่ศาสนาอิสลาม'
    round = 'รอบที่ 1 (ภาคเรียนที่ 1)'
    answers = @{ 'part1:1'=2;'part1:2'=2;'part1:3'=2;'part1:4'=2;'part1:5'=2;'part1:6'=2;'part1:7'=2;'part1:8'=2;'part1:9'=2;'part1:10'=2;'part1:11'=2;'part1:12'=2;'part1:13'=2;'part1:14'=2;'part1:15'=1 }
    notes = @{ 'part1:15' = 'ทดสอบหมายเหตุ' }
    s1 = 30; s2 = ''; s3 = 8; s4 = 4
    totalScore = 38; pct = 68; level = 'ดี'
    strengths = @('จุดแข็งทดสอบ'); develop = @('ประเด็นพัฒนาทดสอบ'); support = @(); agreements = @()
    fiveQ = @{}; comment = ''; evalDate = (Get-Date -Format 'yyyy-MM-dd')
  }
  $save = Post @{ action = 'saveSchoolEvaluation'; payload = @{ supervisor = 'ทดสอบระบบอัตโนมัติ'; schoolData = $sch; evalData = $eval } }
  Log "success=$($save.success) | $($save.message)"
  if (-not $save.success) { throw "CREATE failed" }

  $h1 = Post @{ action = 'getSchoolEvaluations'; payload = [string]$c.id }
  $p1 = @($h1.data)[0]
  $rowNo = [int]$p1.row
  Log "verify: sheetRow=$rowNo form=$($p1.form) total=$($p1.totalScore) pct=$($p1.pct) level=$($p1.level)"
  $s1 = Post @{ action = 'getStatsSchool' }
  Log "totalEval=$($s1.data.totalEval) (expect $($baseline + 1))"

  Write-Host "=== [4] UPDATE (editRow=$rowNo -> 35/44=80% = ดีมาก) ===" -ForegroundColor Cyan
  $eval.level = 'ดีมาก'; $eval.totalScore = 35; $eval.pct = 80; $eval.s1 = 35
  $u = Post @{ action = 'saveSchoolEvaluation'; payload = @{ supervisor = 'ทดสอบระบบอัตโนมัติ'; editRow = [string]$rowNo; schoolData = $sch; evalData = $eval } }
  Log "success=$($u.success) | lastEdit=$($u.lastEdit) by $($u.lastEditor)"
  $h2 = Post @{ action = 'getSchoolEvaluations'; payload = [string]$c.id }
  $p2 = @($h2.data)[0]
  Log "verify: total=$($p2.totalScore) pct=$($p2.pct) level=$($p2.level) lastEditor=$($p2.lastEditor)"
  $s2 = Post @{ action = 'getStatsSchool' }
  Log "totalEval=$($s2.data.totalEval) (expect $($baseline + 1) - ไม่เพิ่มแถว)"

  Write-Host "=== [5] SECURITY: non-admin delete ต้องถูกปฏิเสธ ===" -ForegroundColor Cyan
  $sec = Post @{ action = 'deleteSchoolEvaluation'; payload = @{ admin = '__not_admin__'; row = $rowNo } }
  Log "success=$($sec.success) (expect False) | $($sec.message)"

  Write-Host "=== [6] DELETE by admin ===" -ForegroundColor Cyan
  $lg = Post @{ action = 'login'; payload = @{ username = $ADMIN_USER; password = $ADMIN_PASS } }
  Log "login admin success=$($lg.success) role=$($lg.userData.role)"
  if ($lg.success -and $lg.userData.role -eq 'ผู้ดูแลระบบ') {
    $bad = Post @{ action = 'deleteSchoolEvaluation'; payload = @{ admin = $ADMIN_USER; row = 999999 } }
    Log "delete wrong-row success=$($bad.success) (expect False) | $($bad.message)"
    $del = Post @{ action = 'deleteSchoolEvaluation'; payload = @{ admin = $ADMIN_USER; row = $rowNo } }
    Log "delete row ${rowNo}: success=$($del.success) | $($del.message)"
  } else {
    Write-Host "  !! ไม่มีสิทธิ์ admin - ข้าม (ข้อมูลทดสอบยังอยู่ใน DATA_SCHOOL!)" -ForegroundColor Yellow
  }

  Write-Host "=== [7] FINAL STATE ===" -ForegroundColor Cyan
  $h3 = Post @{ action = 'getSchoolEvaluations'; payload = [string]$c.id }
  $left = @($h3.data).Count
  $s3 = Post @{ action = 'getStatsSchool' }
  Log "remaining eval records for school = $left"
  Log "totalEval=$($s3.data.totalEval) (baseline=$baseline)"
  if ([int]$s3.data.totalEval -eq $baseline) {
    Write-Host "`n=== PASS: CRUD ครบ + ชีตกลับสู่ baseline ===" -ForegroundColor Green
  } else {
    Write-Host "`n=== WARN: ยังมีข้อมูลทดสอบค้าง ตรวจ DATA_SCHOOL ===" -ForegroundColor Yellow
  }
}

Write-Host "`n=== ทดสอบเพิ่มเติม: login + users ===" -ForegroundColor Cyan
$lg = Post @{ action = 'login'; payload = @{ username = $ADMIN_USER; password = $ADMIN_PASS } }
Log "login admin: success=$($lg.success) role=$($lg.userData.role)"
$ug = Post @{ action = 'getUsers'; payload = @{ username = $ADMIN_USER } }
Log "getUsers: count=$($ug.data.Count) isAdmin=$($ug.success)"

Write-Host "`n=== เสร็จสิ้นการทดสอบ ===" -ForegroundColor Green
