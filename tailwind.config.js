/** @type {import('tailwindcss').Config} */
// DESIGN.md("Harmonious Public Care") 토큰을 그대로 옮겨온 설정입니다.
const plugin = require("tailwindcss/plugin");

/**
 * Pretendard GOV 는 굵기별 정적 파일을 각각의 패밀리 이름으로 로드합니다
 * (src/app/_layout.tsx 의 useFonts 와 이름이 일치해야 합니다).
 * iOS·Android·웹 모두 같은 이름으로 동작하며, 파일 자체가 해당 굵기이므로
 * fontWeight 는 normal 로 고정해 합성 볼드(fake bold)가 겹치지 않게 합니다.
 */
const GOV = {
  400: "PretendardGOV-Regular",
  500: "PretendardGOV-Medium",
  600: "PretendardGOV-SemiBold",
  700: "PretendardGOV-Bold",
};

// 접근성 기준: 최소 16px. (공공 서비스 · 시니어 · 다문화 이용자 가독성)
const TYPE_SCALE = {
  "display-lg": ["34px", { lineHeight: "42px" }],
  "headline-xl": ["28px", { lineHeight: "36px" }],
  "headline-md": ["24px", { lineHeight: "32px" }],
  "title-lg": ["20px", { lineHeight: "28px" }],
  "body-lg": ["18px", { lineHeight: "28px" }],
  "body-md": ["17px", { lineHeight: "26px" }],
  "body-sm": ["16px", { lineHeight: "24px" }],
  "label-md": ["17px", { lineHeight: "24px" }],
  "label-sm": ["16px", { lineHeight: "22px" }],
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1B4D89",
          deep: "#10315C",
          soft: "#EBF2FA",
          fixed: "#D5E3FF",
        },
        accent: {
          DEFAULT: "#EA5414",
          amber: "#FA8C16",
          soft: "#FFF3EC",
        },
        success: {
          DEFAULT: "#008A5E",
          soft: "#E6F6F0",
        },
        danger: {
          DEFAULT: "#BA1A1A",
          soft: "#FFDAD6",
        },
        ink: "#1A202C",
        muted: "#4A5568",
        subtle: "#737781",
        line: "#DCE3EC",
        ice: "#F4F7FB",
        canvas: "#FFFFFF",
        // 글래스모피즘 표면 (backdrop-blur 와 함께 사용)
        glass: {
          DEFAULT: "rgba(255,255,255,0.62)",
          strong: "rgba(255,255,255,0.82)",
          soft: "rgba(255,255,255,0.4)",
          border: "rgba(255,255,255,0.8)",
          dark: "rgba(16,49,92,0.45)",
        },
      },
      fontFamily: {
        sans: [GOV[400]],
        gov: [GOV[400]],
        "gov-medium": [GOV[500]],
        "gov-semibold": [GOV[600]],
        "gov-bold": [GOV[700]],
      },
      fontSize: TYPE_SCALE,
      // Apple 스타일의 연속 곡률 느낌을 위해 라운드를 한 단계 키움
      borderRadius: {
        sm: "10px",
        DEFAULT: "14px",
        md: "18px",
        lg: "22px",
        xl: "28px",
        full: "9999px",
      },
      // 여백 스케일 — DESIGN.md 기본값의 약 2배 (넉넉한 호흡, 글래스 카드 간 분리감)
      spacing: {
        xxs: "8px",
        xs: "14px",
        sm: "20px",
        md: "28px",
        lg: "44px",
        xl: "60px",
        "2xl": "88px",
        "3xl": "120px",
      },
    },
  },
  plugins: [
    // 1) 모든 타입 스케일 클래스에 기본 서체(Regular) 주입
    // 2) 굵기 클래스는 해당 굵기의 정적 파일로 교체 (선언 순서상 1)보다 뒤라 우선 적용)
    plugin(({ addUtilities }) => {
      const sizeRules = Object.fromEntries(
        Object.keys(TYPE_SCALE).map((name) => [`.text-${name}`, { fontFamily: GOV[400] }])
      );
      addUtilities(sizeRules);
      addUtilities({
        ".font-normal": { fontFamily: GOV[400], fontWeight: "400" },
        ".font-medium": { fontFamily: GOV[500], fontWeight: "400" },
        ".font-semibold": { fontFamily: GOV[600], fontWeight: "400" },
        ".font-bold": { fontFamily: GOV[700], fontWeight: "400" },
      });
    }),
  ],
};
