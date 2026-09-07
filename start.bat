@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ============================================================
echo            🚀 familyNet Expo ^& Web Server Launcher
echo ============================================================
echo 1) 🌐 웹 브라우저에서 바로 확인 (Expo Web - 추천)
echo 2) 📱 모바일 Expo 개발 서버 (QR코드 스캔 / Expo Go)
echo 3) 🤖 Android 에뮬레이터 실행
echo 4) 🧹 Metro 캐시 삭제 후 서버 시작
echo ============================================================

set "CHOICE=%1"
if "%CHOICE%"=="" (
    set /p "CHOICE=실행할 모드를 선택하세요 [1-4] (기본값: 1): "
)
if "%CHOICE%"=="" set "CHOICE=1"

if not exist "node_modules\" (
    echo 📦 의존성 패키지가 없습니다. npm install을 진행합니다...
    call npm install
)

if "%CHOICE%"=="1" (
    echo 🌐 웹 브라우저에서 바로 확인 가능한 웹 서버를 실행합니다...
    call npx expo start --web
) else if "%CHOICE%"=="2" (
    echo 📱 Expo 모바일 개발 서버를 실행합니다...
    call npx expo start
) else if "%CHOICE%"=="3" (
    echo 🤖 Android 에뮬레이터로 실행합니다...
    call npx expo start --android
) else if "%CHOICE%"=="4" (
    echo 🧹 Metro 캐시를 정리하고 실행합니다...
    call npx expo start -c
) else if /i "%CHOICE%"=="web" (
    call npx expo start --web
) else (
    echo 🌐 기본 웹 모드로 실행합니다...
    call npx expo start --web
)

pause
