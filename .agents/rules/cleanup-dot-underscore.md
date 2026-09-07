---
description: Automatically delete ._* AppleDouble files whenever generated or discovered
---

# AppleDouble (._*) 파일 즉시 삭제 규칙

- macOS 외장하드 작업 시 생성되는 `._*` 임시 메타데이터 파일은 발견되거나 생성되는 즉시 무조건 삭제한다.
- 파일 생성/수정 작업 후 필요 시 `find . -name "._*" -delete`를 실행하여 깨끗한 상태를 유지한다.
