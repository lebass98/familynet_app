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

const TYPE_SCALE = {
  "display-lg": ["30px", { lineHeight: "40px" }],
  "headline-xl": ["24px", { lineHeight: "34px" }],
  "headline-md": ["22px", { lineHeight: "32px" }],
  "title-lg": ["18px", { lineHeight: "26px" }],
  "body-lg": ["16px", { lineHeight: "26px" }],
  "body-md": ["15px", { lineHeight: "24px" }],
  "body-sm": ["13px", { lineHeight: "20px" }],
  "label-md": ["14px", { lineHeight: "20px" }],
  "label-sm": ["12px", { lineHeight: "16px" }],
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
      },
      fontFamily: {
        sans: [GOV[400]],
        gov: [GOV[400]],
        "gov-medium": [GOV[500]],
        "gov-semibold": [GOV[600]],
        "gov-bold": [GOV[700]],
      },
      fontSize: TYPE_SCALE,
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
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
