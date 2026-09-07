# 📱 패밀리넷 (familyNet) 모바일 앱 — 가족e음

전국 가족센터를 하나의 앱으로 — **홈(디지털 가족패스·원스톱 서비스·맞춤 지원사업)**, **스마트패스(QR·바코드 출석, 공간 예약, 장난감 대여, 육아 품앗이)**, **가족상담(공인 상담사 매칭·마음 날씨·핫라인)**, **다문화·마이(다누리 다국어·이지 모드·진행 서비스·마이 서랍)** 4개 탭으로 구성된 크로스 플랫폼(iOS·Android·Web) 앱입니다.
React Native + **Expo SDK 57**, **Tailwind CSS (NativeWind v4)** 기반이며, 디자인은 `DESIGN.md`(Harmonious Public Care) 토큰을 따릅니다.

> 현재는 **시연용 목업 데이터**로 동작합니다. `src/services/familynet.ts` 의 구현만 실제 패밀리넷 API 로 교체하면 화면 코드는 그대로 유지됩니다.

---

## 🛠 기술 스택 (Tech Stack)

| 구분 | 기술 / 라이브러리 | 버전 |
| :--- | :--- | :--- |
| **Framework** | [Expo SDK](https://expo.dev) | `~57.0.20` |
| **Core** | [React Native](https://reactnative.dev) | `0.86.3` |
| **Runtime** | [React](https://react.dev) | `19.2.3` |
| **Routing** | [Expo Router](https://docs.expo.dev/router/introduction/) | `~57.0.19` (파일 기반 라우팅) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) & [NativeWind](https://www.nativewind.dev) | Tailwind `^3.4.17` / NativeWind `^4.2.6` |
| **Language** | [TypeScript](https://www.typescriptlang.org) | `~6.0.3` |
| **Font** | [Pretendard GOV](https://github.com/orioncactus/pretendard) (SIL OFL) | `1.3.9` — `assets/fonts/` 굵기별 정적 OTF 4종 |
| **CI / CD** | GitHub Actions | Lint, TypeCheck, Web Export |

---

## 🚀 빠른 시작 (Quick Start) - 모든 OS 지원

각 운영체제별 원클릭 실행 배치/스크립트 파일이 준비되어 있습니다.

### 🍎 macOS & 🐧 Linux
```bash
# 1. 대화형 메뉴로 실행 (웹, 모바일, 에뮬레이터 등 선택)
./start.sh

# 2. 웹 브라우저에서 바로 확인
./start-web.sh
# 또는
./start.sh web

# 3. macOS Finder에서 더블 클릭 실행
start.command 더블 클릭
```

### 🪟 Windows
```cmd
:: 1. 명령 프롬프트 / 탐색기 더블 클릭으로 대화형 실행
start.bat
:: 또는
start.cmd

:: 2. 웹 브라우저에서 바로 확인 (원클릭)
start-web.bat

:: 3. PowerShell 환경에서 실행
.\start.ps1
```

---

## 💻 표준 npm 명령어

```bash
# 의존성 설치
npm install

# 웹 브라우저로 바로 실행 (http://localhost:8081)
npm run web

# Expo 개발 서버 시작 (QR 코드 및 대화형 CLI)
npm start

# Android 에뮬레이터 실행
npm run android

# iOS 시뮬레이터 실행 (macOS)
npm run ios

# TypeScript 타입 검사
npx tsc --noEmit

# ESLint 코드 스타일 검증
npm run lint
```

---

## 🎨 Tailwind CSS (NativeWind v4) 사용법

React Native 표준 컴포넌트(`View`, `Text`, `Pressable`, `TouchableOpacity` 등)에서 웹과 동일하게 `className` 속성을 사용할 수 있습니다.

```tsx
import { View, Text, Pressable } from 'react-native';

export function ExampleCard() {
  return (
    <View className="bg-indigo-600 p-5 rounded-2xl shadow-lg border border-indigo-400/30">
      <Text className="text-white text-lg font-bold">✨ Tailwind CSS 스타일링</Text>
      <Text className="text-indigo-100 text-sm mt-1">
        모바일(iOS/Android)과 웹 모두에서 동일하게 반응형 스타일이 적용됩니다.
      </Text>
      <Pressable 
        className="mt-4 bg-white/20 active:bg-white/30 px-4 py-2 rounded-xl self-start"
        onPress={() => console.log('clicked')}
      >
        <Text className="text-white font-semibold text-sm">확인하기</Text>
      </Pressable>
    </View>
  );
}
```

---

## 📁 프로젝트 구조 (Project Structure)

```
familyNet/
├── .github/workflows/ci.yml     # GitHub Actions (타입검사·린트·웹 번들)
├── assets/                      # 앱 아이콘, 스플래시 이미지
├── DESIGN.md                    # 디자인 시스템 토큰 (색상·타이포·간격)
├── src/
│   ├── app/                     # Expo Router 화면 (파일 기반 라우팅)
│   │   ├── _layout.tsx          # 루트 Stack + 전역 스토어 Provider
│   │   ├── (tabs)/              # 하단 탭: 홈 · 스마트패스 · 가족상담 · 다문화·마이
│   │   ├── programs.tsx         # 프로그램 목록 (검색·필터)
│   │   ├── program/[id].tsx     # 프로그램 상세 · 신청/대기/취소
│   │   ├── reserve.tsx          # 공동육아나눔터 예약 (공간·날짜·시간대)
│   │   ├── toys.tsx             # 장난감 도서관 전체 교구 · 대여
│   │   ├── alerts.tsx           # 알림함 · 관심 키워드 · 푸시 설정
│   │   ├── center-select.tsx    # 우리동네 센터 선택 (거리순·즐겨찾기)
│   │   └── qr/[id].tsx          # QR 스마트패스 전체화면 (체크인 시연)
│   ├── components/
│   │   ├── ui/                  # Button · Card · Badge · Screen · Sheet · Glass(글래스모피즘) 등
│   │   ├── icon.tsx             # 의존성 없는 View 도형 아이콘 세트 (34종)
│   │   ├── app-header.tsx       # 공통 헤더 (가족e음·센터 선택·알림·프로필)
│   │   ├── qr-code.tsx / barcode.tsx  # 시연용 QR·바코드 렌더러
│   │   ├── avatar.tsx           # 이니셜 아바타 (외부 이미지 없음)
│   │   ├── institution-footer.tsx     # 공공기관 푸터
│   │   ├── tab-bar.tsx          # 커스텀 하단 탭바
│   │   ├── program-card.tsx / center-card.tsx
│   ├── features/pass/           # 내 패스 · 공간 예약 · 장난감 대여 화면 로직
│   ├── store/app-store.tsx      # 전역 상태 (센터·관심키워드·신청·패스·알림)
│   ├── services/familynet.ts    # 데이터 접근 레이어 (목업 → 실 API 교체 지점)
│   ├── mocks/data.ts            # 시연용 센터·프로그램·공간·장난감·알림 데이터
│   ├── types/domain.ts          # 도메인 타입 (API 계약)
│   ├── utils/format.ts          # 날짜·요금·거리·상태 표기 유틸
│   ├── constants/design.ts      # DESIGN.md 토큰의 TS 미러 (그림자·최대폭 등)
├── assets/fonts/                # Pretendard GOV Regular·Medium·SemiBold·Bold (+ OFL 라이선스)
│   └── global.css               # Tailwind 지시어 + 웹 기본 서체
├── tailwind.config.js           # DESIGN.md 색상·타이포·라운드·간격 토큰
├── app.json                     # 앱 이름 '패밀리넷', 스플래시 #10315C
└── start.* / start-web.*        # OS별 원클릭 실행 스크립트
```
```

---

## 🌐 GitHub Pages 배포 (Live Demo)

- **공개 배포 URL**: [https://lebass98.github.io/familynet_app/](https://lebass98.github.io/familynet_app/)
- **자동 배포 파이프라인**:
  - `main` 브랜치에 `push` 시 GitHub Actions(`.github/workflows/ci.yml`)가 자동으로 린트·타입검사 후 `scripts/build-web.js`로 정적 사이트를 빌드하고 `gh-pages` 브랜치로 배포합니다.
  - 서브패스(`/familynet_app/`) 에셋 참조를 위해 `app.json`에 `experiments.baseUrl`이 설정되어 있습니다.
  - Jekyll의 `_expo/` 정적 에셋 무시 방지(`.nojekyll`) 및 SPA 클라이언트 라우팅 404 방지(`404.html`)가 자동 생성됩니다.
- **수동 배포 명령어**:
  ```bash
  npm run deploy
  ```
- **GitHub 저장소 설정 (초기 1회 확인)**:
  1. GitHub 저장소 `Settings` 탭 진입
  2. 좌측 메뉴 `Pages` 클릭
  3. `Build and deployment` > `Source`를 **Deploy from a branch**로 선택
  4. `Branch`를 **`gh-pages`** / `/(root)`로 선택 후 저장

---

## 🔄 GitHub Actions CI & 배포

`.github/workflows/ci.yml`을 통해 모든 `push` 및 `pull_request` 발생 시 다음 작업이 자동 수행됩니다:
1. **TypeScript 타입 검사** (`npx tsc --noEmit`)
2. **ESLint 정적 분석** (`npm run lint`)
3. **GitHub Pages 웹 빌드 및 배포** (`npm run build:web` → `gh-pages` 브랜치 배포)

---

## 📅 작업 내역 (Changelog)

### 2026-09-08 (6차) — GitHub Pages 웹 배포 환경 구축
- **GitHub Pages 서브패스 연동**: `app.json`에 `experiments.baseUrl: "/familynet_app"` 적용하여 `https://lebass98.github.io/familynet_app/`에서 모든 번들과 에셋 경로가 정상 동작하도록 설정
- **정적 빌드 자동화 스크립트(`scripts/build-web.js`)**:
  - `dist/.nojekyll` 자동 생성: GitHub Pages Jekyll 엔진에 의한 `_expo/` 정적 디렉터리 404 차단 방지
  - `dist/404.html` 자동 복제: SPA 클라이언트 라우팅 새로고침 및 서브경로 직접 접속 지원
- **배포 스크립트 및 의존성 추가**: `gh-pages` 패키지 설치, `npm run build:web`, `npm run deploy` 명령어 등록 및 초기 `gh-pages` 브랜치 생성/배포 완료
- **GitHub Actions 워크플로우 갱신**: `main` 푸시 시 린트·타입검사 완료 후 자동으로 GitHub Pages(`gh-pages` 브랜치)로 배포되도록 CI 파이프라인 업그레이드

### 2026-09-08 (5차) — 여백 2배 확대
- 여백 토큰을 약 2배로 상향(xxs 8 · xs 14 · sm 20 · md 28 · lg 44 · xl 60 · 2xl 88 · 3xl 120)해 화면 가장자리·카드 내부·섹션 간격을 넉넉하게 조정, 플로팅 탭바 하단 여백 20px
- 좁은 화면에서 겹치던 홈 히어로 하단 문구를 줄바꿈 허용으로, 상담 히어로 3열 보장 타일은 문구·패딩을 축약해 한 줄 유지

### 2026-09-08 (4차) — 최소 16px 타이포 + 애플 글래스모피즘
- **타이포 스케일 상향(최소 16px)**: label-sm 16 · label-md 17 · body-sm 16 · body-md 17 · body-lg 18 · title-lg 20 · headline-md 24 · headline-xl 28 · display-lg 34. 배지·칩·버튼·탭 라벨을 그에 맞춰 44~56px 터치 높이로 확대
- **글래스모피즘**: `components/ui/glass.tsx` 신설 — `GlassBackdrop`(iOS 26+ `expo-glass-effect` 리퀴드 글래스 / 그 외 반투명+헤어라인 / 웹 `backdrop-filter` 블러), `AmbientBackground`(화면 뒤 색 번짐). 카드·헤더·상세 헤더·확인 시트·플로팅 필 탭바를 글래스 표면으로 교체하고 라운드를 한 단계 확대(14~28px)
- 화면 내 불투명 패널(`bg-canvas`/`bg-ice`/`border-line`)을 반투명 표면으로 일괄 치환(QR·바코드 영역은 대비를 위해 흰색 유지), 스택 화면에도 앰비언트 배경 적용
- `expo export --platform ios` 로 네이티브 CSS 컴파일 검증, 웹 스크린샷으로 전 탭 확인

### 2026-09-08 (3차) — 서체 Pretendard GOV 전면 적용
- **Pretendard GOV 1.3.9** 굵기별 정적 OTF(Regular·Medium·SemiBold·Bold)를 `assets/fonts/`에 추가하고 루트 레이아웃에서 `expo-font`의 `useFonts`로 로드 (iOS·Android·웹 공통, 웹은 정적 렌더링을 막지 않도록 font-swap)
- **Tailwind 플러그인**으로 모든 타입 스케일 클래스(`text-body-md` 등)에 Regular 패밀리를, `font-medium/semibold/bold` 클래스에 해당 굵기 파일 패밀리를 주입 → 화면 코드 수정 없이 전체 텍스트에 적용. 굵기 파일을 직접 쓰므로 `fontWeight`는 400으로 고정해 합성 볼드 중복을 방지
- 웹 빌드에서 4개 폰트 로드 및 제목 요소 계산값(`PretendardGOV-Bold`) 확인

### 2026-09-08 (2차) — 목업 기반 디자인 개편
- **탭 구조 재편**: 홈 · 스마트패스 · 가족상담 · 다문화·마이 4탭 (프로그램·알림·예약·장난감은 스택 화면으로 이동), 전 탭 공통 헤더(가족e음·공공인증·센터 선택·알림·프로필) 도입
- **홈**: 기관 인증 배너, 디지털 가족패스 히어로(바코드·QR 체크인), 마감임박 티커, 주요 원스톱 서비스 2×2(실시간 여석·재고), 시즌 캠페인 배너, 맞춤 지원사업 필터, 가족상담전화 배너, 기관 푸터
- **스마트패스**: QR+바코드 통합 패스 카드(인증 유효시간 카운트다운·갱신·밝기 토글·원터치 출석 체크), 오늘 이용 예약(예약 변경·길찾기), 장난감 대여 현황(연장 신청·실시간 보유·바로/알림 예약), 우리동네 육아 품앗이(참여 신청·모임 개설), 안내데스크
- **가족상담(신규, 제안서 04)**: 안심상담 히어로·3대 보장, 고민 분야 필터, 공인 상담사 카드(평점·방식·오늘 가능·예약 신청), 우리 가족 마음 날씨(감정 다이어리 → AI 힐링 추천), 24시간 핫라인·비밀 채팅상담
- **다문화·마이(신규, 제안서 03)**: 다누리 8개 언어 선택, 프로필·이지 모드(큰 글씨), 다누리 콜센터 1577-1366, 나의 센터 활동, 진행 중 맞춤 서비스(언어발달·한국어교실 진도), 자조모임·체류비자 가이드, 마이 서랍, KIHF 푸터
- **컴포넌트/데이터**: 아이콘 19종 추가, 바코드·아바타·푸터 컴포넌트, 상담사·품앗이·다문화 서비스·언어·캠페인 목업, 스토어에 언어·이지모드·상담신청·감정·모임참여 상태 추가
- **검증**: `tsc`·`expo lint` 통과, 웹 export 정적 라우트 17개, 헤드리스 Chrome으로 전 탭 스크린샷 확인

### 2026-09-08
- **패밀리넷 앱 1차 구현 (제안서 01 통합 알리미 + 02 스마트패스 범위)**
  - 하단 5탭 구성: 홈 · 프로그램 · 스마트패스 · 알림 · 마이 (`expo-router/js-tabs` + 커스텀 탭바)
  - 홈: GPS(목업) 기반 우리동네 센터 자동 매칭, 즐겨찾기, 빠른 메뉴, 관심 키워드 추천, 마감 임박 목록
  - 프로그램: 검색·카테고리 필터·모집중/우리동네 토글, 상세 화면에서 신청/대기/취소 (확인 시트)
  - 스마트패스: 내 패스 목록, 공간 예약(공간·날짜·시간대 선택), 장난감 대여 → QR 패스 자동 발급, 전체화면 QR + 체크인 시연
  - 알림: 푸시 on/off, 관심 키워드 설정, 알림함(읽음 처리·딥링크)
  - 마이: 신청 내역, 즐겨찾기 센터, 푸시·생체인증 설정
- **디자인 시스템 적용**: `DESIGN.md` 토큰을 `tailwind.config.js` 와 `src/constants/design.ts` 로 이관, 앱 이름·스플래시·라이트 모드 고정
- **아키텍처**: 도메인 타입 → 목업 데이터 → 서비스 레이어 → 전역 스토어(Context) → 화면 순으로 분리해 실 API 교체 지점을 `services/familynet.ts` 하나로 한정
- **품질 검증**: `tsc`·`expo lint` 통과, `expo export --platform web` 정적 라우트 15개 빌드 성공, 헤드리스 Chrome 스크린샷으로 주요 화면 확인
- **스타터 코드 정리**: Expo 템플릿 화면·컴포넌트 제거, `._*` AppleDouble 파일 정리

### 2026-09-07
- **프로젝트 초기 환경 구축**: Expo SDK 57 및 React Native(0.86.3), React 19 기반 모바일 & 웹 프로젝트 생성
- **Tailwind CSS 연동**: NativeWind v4 및 Tailwind CSS 3.4 설정 완료 (`global.css`, `tailwind.config.js`, `metro.config.js`, `babel.config.js`)
- **UI 데모 카드 추가**: `src/app/index.tsx`에 Tailwind `className`을 활용한 반응형 UI 컴포넌트 카드 구현
- **크로스 플랫폼 실행 스크립트 작성**:
  - macOS/Linux: `start.sh`, `start-web.sh`, `start.command` (대화형 및 원클릭 실행)
  - Windows: `start.bat`, `start-web.bat`, `start.cmd`, `start.ps1`
- **품질 관리 및 CI 설정**: ESLint Flat Config, TypeScript 무결성 검증, GitHub Actions CI(`ci.yml`) 워크플로우 등록
- **프로젝트 규칙 수립**:
  - macOS `._*` (AppleDouble) 파일 자동 제거 규칙
  - Git 한글 커밋 메시지 작성 및 커밋 전 `git pull` 동기화 규칙
  - README.md 일자별 작업 내역 지속 갱신 규칙
- **GitHub 연동**: `familynet_app` 원격 저장소 연결 및 코드 푸시 완료
