import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Icon } from '@/components/icon';
import { GlassBackdrop } from '@/components/ui/glass';
import { MaxContentWidth, Palette } from '@/constants/design';
import { useAppStore } from '@/store/app-store';

/** 전 탭 공통 상단 헤더 — 브랜드 · 센터 선택 · 알림 · 프로필 */
export function AppHeader() {
  const router = useRouter();
  const { selectedCenter, locating, unreadCount, user } = useAppStore();

  return (
    <View className="overflow-hidden">
      <GlassBackdrop tone="strong" radius={0} />
      <View
        className="h-[64px] w-full flex-row items-center justify-between self-center px-md"
        style={{ maxWidth: MaxContentWidth }}>
        <View className="flex-1 flex-row items-center gap-xs">
          <View className="flex-row items-center gap-xxs">
            <Text className="text-title-lg font-bold text-brand">가족e음</Text>
            <View className="rounded-full bg-success/12 px-xs py-[2px]">
              <Text className="text-label-sm font-semibold text-success">공공인증</Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="이용 센터 변경"
            onPress={() => router.push('/center-select')}
            className="h-[40px] max-w-[190px] flex-row items-center gap-xxs rounded-full bg-brand/10 px-sm active:opacity-70">
            <Icon name="pin" size={16} color={Palette.brand} />
            <Text numberOfLines={1} className="shrink text-label-md font-semibold text-brand-deep">
              {locating ? '위치 확인 중' : (selectedCenter?.name ?? '센터 선택')}
            </Text>
            <Icon name="chevron-right" size={12} color={Palette.subtle} />
          </Pressable>
        </View>

        <View className="flex-row items-center gap-xs">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`알림 ${unreadCount}건`}
            onPress={() => router.push('/alerts')}
            className="h-[44px] w-[44px] items-center justify-center rounded-full active:bg-brand/10">
            <Icon name="bell" size={22} color={Palette.muted} />
            {unreadCount > 0 ? (
              <View className="absolute right-[10px] top-[10px] h-[8px] w-[8px] rounded-full bg-accent" />
            ) : null}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="마이 페이지"
            onPress={() => router.push('/my')}
            className="active:opacity-70">
            <Avatar name={user.name} size={36} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
