import { Text, View } from 'react-native';

const TONES = [
  { bg: 'bg-brand-soft', text: 'text-brand' },
  { bg: 'bg-accent-soft', text: 'text-accent' },
  { bg: 'bg-success-soft', text: 'text-success' },
];

/** 사진 대신 이니셜로 표시하는 아바타 (외부 이미지 의존 없음) */
export function Avatar({
  name,
  size = 40,
  className = '',
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const initial = name.trim().charAt(0);
  const tone = TONES[initial.charCodeAt(0) % TONES.length];
  return (
    <View
      className={`items-center justify-center rounded-full ${tone.bg} ${className}`}
      style={{ width: size, height: size }}>
      <Text className={`font-bold ${tone.text}`} style={{ fontSize: size * 0.42 }}>
        {initial}
      </Text>
    </View>
  );
}
