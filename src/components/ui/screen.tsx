import { Pressable, ScrollView, Text, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { MaxContentWidth, Palette, TabBarHeight } from '@/constants/design';

/** 탭 화면 공통 컨테이너 — 배경/세이프에어리어/최대 폭을 통일합니다. */
export function Screen({
  children,
  scroll = true,
  header = false,
  topBar,
  className = '',
  contentClassName = '',
  ...rest
}: {
  children: React.ReactNode;
  scroll?: boolean;
  /** 탭 화면 공통 헤더(브랜드·센터·알림·프로필) 표시 */
  header?: boolean;
  /** 스택 화면용 상단 바 (DetailHeader 등) */
  topBar?: React.ReactNode;
  className?: string;
  contentClassName?: string;
} & ScrollViewProps) {
  // alignItems: 'center' 를 쓰면 웹에서 nowrap 텍스트가 컨테이너 폭을 밀어내므로
  // 자식은 stretch 시키고 alignSelf 로만 가운데 정렬합니다.
  const inner = (
    <View
      className={`w-full flex-1 self-center ${contentClassName}`}
      style={{ maxWidth: MaxContentWidth }}>
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} className={`flex-1 bg-ice ${className}`}>
      {header ? <AppHeader /> : null}
      {topBar}
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: TabBarHeight + 32 }}
          showsVerticalScrollIndicator={false}
          {...rest}>
          <View
            className={`w-full self-center ${contentClassName}`}
            style={{ maxWidth: MaxContentWidth }}>
            {children}
          </View>
        </ScrollView>
      ) : (
        inner
      )}
    </SafeAreaView>
  );
}

/** 상세 화면용 헤더 (뒤로가기 + 제목) */
export function DetailHeader({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View className="h-[56px] flex-row items-center gap-xs border-b border-line bg-canvas px-xs">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="뒤로 가기"
        onPress={onBack}
        className="h-[44px] w-[44px] items-center justify-center active:opacity-60">
        <Icon name="chevron-left" size={22} color={Palette.ink} />
      </Pressable>
      <Text numberOfLines={1} className="flex-1 text-title-lg font-semibold text-ink">
        {title}
      </Text>
      {right}
    </View>
  );
}

/** 섹션 제목 + 더보기 */
export function SectionHeader({
  title,
  actionLabel,
  onAction,
  className = '',
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <View className={`flex-row items-center justify-between ${className}`}>
      <Text className="text-headline-md font-bold text-ink">{title}</Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          className="h-[32px] flex-row items-center gap-xxs active:opacity-60">
          <Text className="text-label-md font-semibold text-brand">{actionLabel}</Text>
          <Icon name="chevron-right" size={16} color={Palette.brand} />
        </Pressable>
      ) : null}
    </View>
  );
}
