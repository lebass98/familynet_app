@echo off
chcp 65001 > nul
cd /d "%~dp0"

if not exist "node_modules\" (
    echo 📦 node_modules가 없습니다. npm install을 진행합니다...
    call npm install
)

echo 🌐 웹 브라우저에서 바로 확인 가능한 웹 서버를 실행합니다 (http://localhost:8081)...
call npx expo start --web
pause
