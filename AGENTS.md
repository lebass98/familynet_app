# Project Rules

## 1. AppleDouble 파일 (._*) 자동 제거 규칙 (필수 준수)
- macOS 외장하드(exFAT/FAT 등) 특성으로 생성되는 `._*` 파일은 **생성되거나 발견되는 즉시 무조건 삭제**합니다.
- 작업 완료 전 또는 파일 변경 작업 후 항상 `find . -name "._*" -delete` 명령어를 실행하여 정리합니다.
- git commit 및 파일 목록 확인 시 `._*` 파일이 절대 포함되지 않도록 유지합니다.

## 2. Git 커밋 및 동기화 규칙 (필수 준수)
- **한글 커밋 메시지**: Git 커밋 시 메시지는 반드시 명확한 **한글**로 작성합니다.
- **사전 풀다운 및 동기화**: 커밋 및 푸시 작업 전 반드시 `git pull`을 실행하여 원격 저장소의 최신 변경사항을 가져와 동기화한 후 커밋/푸시합니다.

## 3. README 작업 내역 일자별 기록 규칙 (필수 준수)
- 작업을 진행할 때마다 `README.md` 파일 하단의 `📅 작업 내역 (Changelog)` 섹션에 **작업 일자(YYYY-MM-DD)별로 작업 내용을 간략히 정리하여 추가**합니다.
- 코드 변경 커밋 시 `README.md`의 작업 내역도 함께 업데이트하여 커밋합니다.

## 4. Expo Version Documentation
- Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.
