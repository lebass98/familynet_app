import { ActivityIndicator, Pressable, Text, View, type PressableProps } from 'react-native';

import { Palette } from '@/constants/design';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost';
type Size = 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  /** 버튼 왼쪽에 놓을 아이콘 등 */
  leading?: React.ReactNode;
  className?: string;
}

const CONTAINER: Record<Variant, string> = {
  primary: 'bg-brand',
  accent: 'bg-accent',
  outline: 'bg-canvas border border-[#B0C2D8]',
  ghost: 'bg-brand-soft',
};

const LABEL: Record<Variant, string> = {
  primary: 'text-white',
  accent: 'text-white',
  outline: 'text-brand',
  ghost: 'text-brand',
};

/** DESIGN.md Buttons — 최소 44px 터치 높이, 8px 라운드, 600 웨이트 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  leading,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      className={`flex-row items-center justify-center gap-xs rounded ${CONTAINER[variant]} ${
        size === 'lg' ? 'h-[52px] px-lg' : 'h-[44px] px-md'
      } ${isDisabled ? 'opacity-40' : 'active:opacity-80'} ${className}`}
      {...rest}>
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'outline' || variant === 'ghost' ? Palette.brand : '#fff'} />
      ) : (
        <>
          {leading ? <View>{leading}</View> : null}
          <Text className={`text-body-md font-semibold ${LABEL[variant]}`}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}
