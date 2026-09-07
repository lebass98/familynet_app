import { Pressable, Text, View } from 'react-native';

type Tone = 'brand' | 'accent' | 'success' | 'neutral' | 'danger';

const TONE: Record<Tone, { bg: string; text: string }> = {
  brand: { bg: 'bg-brand/10', text: 'text-brand' },
  accent: { bg: 'bg-accent/12', text: 'text-accent' },
  success: { bg: 'bg-success/12', text: 'text-success' },
  neutral: { bg: 'bg-brand-deep/8', text: 'text-muted' },
  danger: { bg: 'bg-danger/10', text: 'text-danger' },
};

/** 상태 칩 — 옅은 틴트 배경 + 진한 텍스트 (16px) */
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
    <View className={`self-start rounded-full px-sm py-[3px] ${TONE[tone].bg} ${className}`}>
      <Text className={`text-label-sm font-semibold ${TONE[tone].text}`}>{label}</Text>
    </View>
  );
}

/** 선택 가능한 필터 칩 — 44px 터치 높이 */
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
      className={`h-[44px] justify-center rounded-full border px-md active:opacity-70 ${
        selected ? 'border-brand bg-brand' : 'border-glass-border bg-glass-strong'
      }`}>
      <Text className={`text-label-md font-semibold ${selected ? 'text-white' : 'text-muted'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
