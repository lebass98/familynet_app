# 📱 familyNet Mobile & Web App

React Native와 **Expo SDK 57**, 그리고 **Tailwind CSS (NativeWind v4)**를 기반으로 구축된 크로스 플랫폼 모바일 & 웹 애플리케이션입니다.

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
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions 자동 빌드 & 테스트 워크플로우
├── assets/                      # 앱 아이콘, 스플래시 이미지 등 정적 리소스
├── src/
│   ├── app/                     # Expo Router 기반 화면 (파일 기반 라우팅)
│   │   ├── _layout.tsx          # 앱 루트 레이아웃 (테마 & global.css 로드)
│   │   ├── index.tsx            # 메인 홈 화면 (Tailwind 데모 카드 포함)
│   │   └── explore.tsx          # 탐색 탭 화면
│   ├── components/              # 재사용 가능한 UI 컴포넌트
│   ├── constants/               # 테마, 색상 및 레이아웃 상수
│   ├── hooks/                   # 커스텀 React 훅
│   └── global.css               # Tailwind CSS 지시어 (@tailwind base, components, utilities)
├── babel.config.js              # NativeWind JSX 변환 Babel 설정
├── eslint.config.js             # ESLint Flat Config
├── metro.config.js              # withNativeWind CSS 번들러 설정
├── nativewind-env.d.ts          # NativeWind & CSS 모듈 타입 선언
├── tailwind.config.js           # Tailwind CSS 설정 및 content 경로
├── start.sh / start-web.sh      # macOS/Linux 실행 스크립트
├── start.command                # macOS Finder 더블 클릭 실행 파일
├── start.bat / start-web.bat    # Windows 배치 실행 파일
└── start.ps1                    # Windows PowerShell 실행 스크립트
```

---

## 🔄 GitHub Actions CI

`.github/workflows/ci.yml`을 통해 모든 `push` 및 `pull_request` 발생 시 다음 작업이 자동 수행됩니다:
1. **TypeScript 타입 검사** (`npx tsc --noEmit`)
2. **ESLint 정적 분석** (`npm run lint`)
3. **웹 프로덕션 번들 빌드 검증** (`npx expo export --platform web`)

---

## 📅 작업 내역 (Changelog)

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
