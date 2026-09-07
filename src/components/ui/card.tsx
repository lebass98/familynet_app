import { Pressable, View, type ViewProps } from 'react-native';

import { GlassBackdrop } from '@/components/ui/glass';
import { ShadowCard } from '@/constants/design';

interface CardProps extends ViewProps {
  className?: string;
  /** 눌렀을 때 동작 — 지정하면 Pressable 로 렌더링 */
  onPress?: () => void;
  /** 상단 4px 강조 바 색상 클래스 (예: bg-accent) */
  accent?: string;
  /** 글래스 농도 */
  tone?: 'regular' | 'strong' | 'soft';
}

const RADIUS = 18;

/** 글래스 카드 — 반투명 표면 + 헤어라인 + 확산 그림자 */
export function Card({
  className = '',
  onPress,
  accent,
  tone = 'regular',
  children,
  style,
  ...rest
}: CardProps) {
  const content = (
    <>
      <GlassBackdrop tone={tone} radius={RADIUS} />
      {accent ? <View className={`h-[4px] w-full ${accent}`} /> : null}
      <View className={accent ? 'p-md' : ''}>{children}</View>
    </>
  );

  const base = `overflow-hidden rounded-md ${accent ? '' : 'p-md'} ${className}`;

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className={`${base} active:opacity-80`}
        style={[ShadowCard, style]}
        {...rest}>
        {content}
      </Pressable>
    );
  }

  return (
    <View className={base} style={[ShadowCard, style]} {...rest}>
      {content}
    </View>
  );
}
