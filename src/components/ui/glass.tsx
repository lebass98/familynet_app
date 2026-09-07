import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

type Tone = 'regular' | 'strong' | 'soft' | 'dark';

const TONE_CLASS: Record<Tone, string> = {
  regular: 'bg-glass border-glass-border',
  strong: 'bg-glass-strong border-glass-border',
  soft: 'bg-glass-soft border-white/40',
  dark: 'bg-glass-dark border-white/20',
};

const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

/**
 * 카드·헤더·탭바 뒤에 까는 글래스 배경 레이어 (absolute fill).
 * - iOS 26+: expo-glass-effect 의 리퀴드 글래스
 * - 그 외 네이티브: 반투명 흰색 + 헤어라인
 * - 웹: 반투명 + backdrop-filter blur (NativeWind 클래스가 실제 CSS 로 출력됨)
 */
export function GlassBackdrop({
  tone = 'regular',
  radius = 18,
  tint,
}: {
  tone?: Tone;
  radius?: number;
  tint?: string;
}) {
  if (liquidGlass && tone !== 'dark') {
    return (
      <GlassView
        pointerEvents="none"
        glassEffectStyle="regular"
        tintColor={tint}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />
    );
  }
  return (
    <View
      pointerEvents="none"
      className={`absolute inset-0 border backdrop-blur-xl ${TONE_CLASS[tone]}`}
      style={{ borderRadius: radius, borderWidth: StyleSheet.hairlineWidth }}
    />
  );
}

/** 글래스 배경을 가진 컨테이너 */
export function Glass({
  tone = 'regular',
  radius = 18,
  className = '',
  children,
  style,
  ...rest
}: { tone?: Tone; radius?: number; className?: string } & ViewProps) {
  return (
    <View className={`overflow-hidden ${className}`} style={[{ borderRadius: radius }, style]} {...rest}>
      <GlassBackdrop tone={tone} radius={radius} />
      {children}
    </View>
  );
}

/** 화면 뒤 은은한 색 번짐 — 글래스가 '유리'로 읽히게 하는 배경 */
export function AmbientBackground() {
  return (
    <View pointerEvents="none" className="absolute inset-0 overflow-hidden">
      <View className="absolute -left-[80px] -top-[60px] h-[320px] w-[320px] rounded-full bg-[#BFD4F5] opacity-70 blur-3xl" />
      <View className="absolute -right-[100px] top-[180px] h-[300px] w-[300px] rounded-full bg-[#FFD6C2] opacity-60 blur-3xl" />
      <View className="absolute -left-[60px] top-[560px] h-[280px] w-[280px] rounded-full bg-[#C6EEDD] opacity-60 blur-3xl" />
      <View className="absolute -right-[80px] top-[900px] h-[300px] w-[300px] rounded-full bg-[#D5E3FF] opacity-70 blur-3xl" />
    </View>
  );
}
