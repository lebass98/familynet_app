import { Pressable, View, type ViewProps } from 'react-native';

import { ShadowCard } from '@/constants/design';

interface CardProps extends ViewProps {
  className?: string;
  /** 눌렀을 때 동작 — 지정하면 Pressable 로 렌더링 */
  onPress?: () => void;
  /** 상단 4px 강조 바 색상 클래스 (예: bg-accent) */
  accent?: string;
}

/** DESIGN.md Service Cards — 12px 라운드, 1px #DCE3EC 보더, Level 1 그림자 */
export function Card({ className = '', onPress, accent, children, style, ...rest }: CardProps) {
  const content = (
    <>
      {accent ? <View className={`h-[4px] w-full ${accent}`} /> : null}
      <View className={accent ? 'p-md' : ''}>{children}</View>
    </>
  );

  const base = `bg-canvas rounded-md border border-line overflow-hidden ${
    accent ? '' : 'p-md'
  } ${className}`;

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
