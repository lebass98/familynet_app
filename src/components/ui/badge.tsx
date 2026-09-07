import { Pressable, Text, View } from 'react-native';

type Tone = 'brand' | 'accent' | 'success' | 'neutral' | 'danger';

const TONE: Record<Tone, { bg: string; text: string }> = {
  brand: { bg: 'bg-brand-soft', text: 'text-brand' },
  accent: { bg: 'bg-accent-soft', text: 'text-accent' },
  success: { bg: 'bg-success-soft', text: 'text-success' },
  neutral: { bg: 'bg-ice', text: 'text-muted' },
  danger: { bg: 'bg-danger-soft', text: 'text-danger' },
};

/** 상태 칩 — 옅은 배경 + 진한 텍스트 (DESIGN.md Status Chips) */
export function Badge({
  label,
  tone = 'brand',
  className = '',
}: {
  label: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <View className={`self-start rounded-full px-xs py-[3px] ${TONE[tone].bg} ${className}`}>
      <Text className={`text-label-sm font-semibold ${TONE[tone].text}`}>{label}</Text>
    </View>
  );
}

/** 선택 가능한 필터 칩 */
export function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`h-[36px] justify-center rounded-full border px-sm active:opacity-70 ${
        selected ? 'border-brand bg-brand' : 'border-line bg-canvas'
      }`}>
      <Text
        className={`text-label-md font-semibold ${selected ? 'text-white' : 'text-muted'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
