# ============================================================
#  deploy.ps1 — อัปเดต Apps Script (ระบบนิเทศออนไลน์ สถานศึกษาเอกชน)
#  วิธีใช้:  powershell -ExecutionPolicy Bypass -File deploy.ps1
#
#  หลักการ: push โค้ด -> สร้าง version ใหม่ -> ชี้ deployment เดิม
#  ไปที่ version ใหม่ (URL ของเว็บแอปคงเดิม)
#  ⚠️ ต้อง clasp login บัญชีเจ้าของ script ก่อนรัน
# ============================================================
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

# Deployment ID ที่ใช้งานจริง (URL คงเดิม — โปรเจกต์ Apps Script ของระบบนิเทศโรงเรียนเอกชน)
$DeploymentId = 'AKfycbzOIsAXOkPAL44dOA8KFxZE7WI3TCtS0ceyswLovl3xpzIfZn6O3wr8lou7FLeHw4Ym3Q'
$WebAppURL = 'https://script.google.com/macros/s/' + $DeploymentId + '/exec'
$CommitMsg = "อัปเดตนิเทศโรงเรียนเอกชน " + (Get-Date -Format 'yyyy-MM-dd HH:mm')

Write-Host "`n=== 1/3 ตรวจสอบ syntax ===" -ForegroundColor Cyan
node --check "$Root\apps-script\รหัส.js"; if ($LASTEXITCODE -ne 0) { throw "รหัส.js syntax ผิด!" }
node --check "$Root\app.js"; if ($LASTEXITCODE -ne 0) { throw "app.js syntax ผิด!" }
node --check "$Root\render.js"; if ($LASTEXITCODE -ne 0) { throw "render.js syntax ผิด!" }
node --check "$Root\tabs.js"; if ($LASTEXITCODE -ne 0) { throw "tabs.js syntax ผิด!" }
Write-Host "Syntax ผ่านเรียบร้อย" -ForegroundColor Green

Write-Host "`n=== 2/3 Push โค้ดขึ้น Apps Script + deploy ===" -ForegroundColor Cyan
clasp push -f
if ($LASTEXITCODE -ne 0) { throw "clasp push ล้มเหลว!" }

$verOut = clasp version "auto $CommitMsg" 2>&1 | Out-String
Write-Host $verOut
$verNum = ($verOut | Select-String '\b(\d+)\b' -AllMatches | ForEach-Object { $_.Matches } | ForEach-Object { [int]$_.Groups[1].Value } | Measure-Object -Maximum | ForEach-Object { $_.Maximum })
if (-not $verNum) { $verNum = 'HEAD' }

clasp redeploy $DeploymentId -V $verNum
if ($LASTEXITCODE -ne 0) { throw "clasp redeploy ล้มเหลว!" }
Write-Host "Deploy version $verNum เรียบร้อย (URL คงเดิม)" -ForegroundColor Green

Write-Host "`n=== 3/3 ตรวจสอบเว็บแอป ===" -ForegroundColor Cyan
Write-Host "URL: $WebAppURL" -ForegroundColor Green
try {
  $body = '{"action":"getPing"}'
  $r = Invoke-WebRequest -Uri $WebAppURL -Method Post `
    -Body $body `
    -ContentType 'text/plain;charset=utf-8' -TimeoutSec 30 -UseBasicParsing
  Write-Host "เว็บแอปตอบกลับ: $($r.StatusCode)" -ForegroundColor Green
  Write-Host $r.Content
} catch {
  Write-Host "ครั้งแรกหลัง deploy อาจ timeout (Apps Script กำลัง build) - ลองใหม่อีกครั้ง" -ForegroundColor Yellow
}

Write-Host "`n=== เสร็จสิ้น (ระบบระบายนิเทศโรงเรียนเอกชนเป็นปัจจุบันแล้ว) ===" -ForegroundColor Green
