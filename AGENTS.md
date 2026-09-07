# Project Rules

## 1. AppleDouble 파일 (._*) 자동 제거 규칙 (필수 준수)
- macOS 외장하드(exFAT/FAT 등) 특성으로 생성되는 `._*` 파일은 **생성되거나 발견되는 즉시 무조건 삭제**합니다.
- 작업 완료 전 또는 파일 변경 작업 후 항상 `find . -name "._*" -delete` 명령어를 실행하여 정리합니다.
- git commit 및 파일 목록 확인 시 `._*` 파일이 절대 포함되지 않도록 유지합니다.

## 2. Expo Version Documentation
- Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.
