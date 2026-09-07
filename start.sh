#!/bin/bash
# ============================================================
# familyNet Expo & Web Server Launcher (macOS / Linux)
# ============================================================

# 스크립트 디렉토리로 이동
cd "$(dirname "$0")"

# AppleDouble (._*) 파일 즉시 삭제 규칙 적용
find . -name "._*" -delete 2>/dev/null

echo "============================================================"
echo "           🚀 familyNet Expo & Web Server Launcher          "
echo "============================================================"
echo "1) 🌐 웹 브라우저에서 바로 확인 (Expo Web - 즉시 확인 추천)"
echo "2) 📱 모바일 Expo 개발 서버 (QR코드 스캔 / Expo Go)"
echo "3) 🤖 Android 에뮬레이터 실행"
echo "4) 🍎 iOS 시뮬레이터 실행 (macOS 전용)"
echo "5) 🧹 Metro 캐시 삭제 후 서버 시작"
echo "============================================================"

# 실행 인자 처리 ($1)
if [ "$1" = "web" ]; then
    CHOICE="1"
elif [ "$1" = "mobile" ] || [ "$1" = "expo" ]; then
    CHOICE="2"
elif [ "$1" = "android" ]; then
    CHOICE="3"
elif [ "$1" = "ios" ]; then
    CHOICE="4"
elif [ "$1" = "clean" ]; then
    CHOICE="5"
else
    read -p "실행할 모드를 선택하세요 [1-5] (기본값: 1): " CHOICE
    CHOICE=${CHOICE:-1}
fi

# node_modules 설치 확인
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules가 없습니다. npm install을 실행합니다..."
    npm install
fi

# 실행 직전 AppleDouble 정리
find . -name "._*" -delete 2>/dev/null

case $CHOICE in
    1)
        echo "🌐 웹 브라우저에서 바로 확인 가능한 서버를 실행합니다..."
        npx expo start --web
        ;;
    2)
        echo "📱 Expo 개발 서버를 실행합니다 (터미널 단축키: w=웹, a=안드로이드, i=iOS, r=새로고침)..."
        npx expo start
        ;;
    3)
        echo "🤖 Android 에뮬레이터로 실행합니다..."
        npx expo start --android
        ;;
    4)
        echo "🍎 iOS 시뮬레이터로 실행합니다..."
        npx expo start --ios
        ;;
    5)
        echo "🧹 Metro 캐시를 정리하고 실행합니다..."
        npx expo start -c
        ;;
    *)
        echo "🌐 기본값인 웹 서버로 실행합니다..."
        npx expo start --web
        ;;
esac
