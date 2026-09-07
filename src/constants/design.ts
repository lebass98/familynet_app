/**
 * DESIGN.md("Harmonious Public Care") 토큰의 TypeScript 미러입니다.
 * NativeWind 클래스로 표현할 수 없는 곳(네비게이션 옵션, 그림자 등)에서 사용합니다.
 */
import { Platform } from 'react-native';

export const Palette = {
  brand: '#1B4D89',
  brandDeep: '#10315C',
  brandSoft: '#EBF2FA',
  accent: '#EA5414',
  accentAmber: '#FA8C16',
  accentSoft: '#FFF3EC',
  success: '#008A5E',
  successSoft: '#E6F6F0',
  danger: '#BA1A1A',
  ink: '#1A202C',
  muted: '#4A5568',
  subtle: '#737781',
  line: '#DCE3EC',
  ice: '#F4F7FB',
  canvas: '#FFFFFF',
} as const;

/** 글래스 카드 — 넓고 옅은 확산 그림자 (Apple 스타일) */
export const ShadowCard = Platform.select({
  ios: {
    shadowColor: '#10315C',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  android: { elevation: 3 },
  default: { boxShadow: '0 10px 30px -12px rgba(16, 49, 92, 0.18), 0 1px 0 rgba(255,255,255,0.6) inset' },
}) as object;

/** DESIGN.md Elevation Level 2 — 모달/플라이아웃/탭바 */
export const ShadowRaised = Platform.select({
  ios: {
    shadowColor: '#10315C',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
  },
  android: { elevation: 12 },
  default: { boxShadow: '0 -8px 20px -4px rgba(16, 49, 92, 0.08)' },
}) as object;

/** 콘텐츠 최대 폭 — 웹/태블릿에서 본문이 과도하게 늘어나지 않도록 제한 */
export const MaxContentWidth = 640;

/** 플로팅 글래스 탭바 높이 + 아래 여백 (세이프에어리어 제외) */
export const TabBarHeight = 72;
export const TabBarOffset = 20;
