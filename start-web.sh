#!/bin/bash
# ============================================================
# familyNet Expo Web Instant Launcher (macOS / Linux)
# ============================================================
cd "$(dirname "$0")"
find . -name "._*" -delete 2>/dev/null

if [ ! -d "node_modules" ]; then
    echo "📦 node_modules가 없습니다. npm install을 실행합니다..."
    npm install
fi

echo "🌐 웹 브라우저에서 바로 확인 가능한 웹 서버를 실행합니다 (http://localhost:8081)..."
npx expo start --web
