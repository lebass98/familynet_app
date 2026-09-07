# ============================================================
# familyNet Expo & Web Server Launcher (PowerShell)
# ============================================================
Set-Location -Path $PSScriptRoot

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "           🚀 familyNet Expo & Web Server Launcher          " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "1) 🌐 웹 브라우저에서 바로 확인 (Expo Web - 추천)"
Write-Host "2) 📱 모바일 Expo 개발 서버 (QR코드 스캔 / Expo Go)"
Write-Host "3) 🤖 Android 에뮬레이터 실행"
Write-Host "4) 🧹 Metro 캐시 삭제 후 서버 시작"
Write-Host "============================================================"

$choice = Read-Host "실행할 모드를 선택하세요 [1-4] (기본값: 1)"
if ([string]::IsNullOrWhiteSpace($choice)) { $choice = "1" }

if (-not (Test-Path "node_modules")) {
    Write-Host "📦 의존성 패키지가 없습니다. npm install을 진행합니다..." -ForegroundColor Yellow
    npm install
}

switch ($choice) {
    "1" { npx expo start --web }
    "2" { npx expo start }
    "3" { npx expo start --android }
    "4" { npx expo start -c }
    default { npx expo start --web }
}
