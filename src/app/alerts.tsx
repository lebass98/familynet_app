import { useRouter } from 'expo-router';
import { Pressable, Switch, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { Badge, FilterChip } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty';
import { DetailHeader, Screen, SectionHeader } from '@/components/ui/screen';
import { Palette } from '@/constants/design';
import { CATEGORIES } from '@/mocks/data';
import { useAppStore } from '@/store/app-store';
import type { NotificationKind } from '@/types/domain';
import { formatRelative } from '@/utils/format';

const KIND_META: Record<NotificationKind, { label: string; icon: IconName; tone: 'brand' | 'accent' | 'success' | 'neutral' }> = {
  'program-open': { label: '접수 시작', icon: 'bell', tone: 'success' },
  deadline: { label: '마감 임박', icon: 'clock', tone: 'accent' },
  reservation: { label: '예약 안내', icon: 'calendar', tone: 'brand' },
  notice: { label: '센터 공지', icon: 'programs', tone: 'neutral' },
};

export default function AlertsScreen() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    interests,
    pushEnabled,
    readNotification,
    readAllNotifications,
    toggleInterest,
    setPushEnabled,
  } = useAppStore();

  return (
    <Screen contentClassName="px-md" topBar={<DetailHeader title="알림" onBack={() => router.back()} />}>
      <View className="flex-row items-end justify-between py-sm">
        <View>
          <Text className="mt-xxs text-body-sm text-muted">
            {unreadCount > 0 ? `읽지 않은 알림 ${unreadCount}건` : '모든 알림을 확인했습니다'}
          </Text>
        </View>
        {unreadCount > 0 ? (
          <Pressable
            accessibilityRole="button"
            onPress={readAllNotifications}
            className="h-[36px] justify-center active:opacity-60">
            <Text className="text-label-md font-semibold text-brand">모두 읽음</Text>
          </Pressable>
        ) : null}
      </View>

      {/* 푸시 설정 */}
      <Card>
        <View className="flex-row items-center gap-sm">
          <View className="h-[40px] w-[40px] items-center justify-center rounded-full bg-brand-soft">
            <Icon name="bell" size={20} color={Palette.brand} />
          </View>
          <View className="flex-1">
            <Text className="text-body-md font-semibold text-ink">관심 프로그램 푸시 알림</Text>
            <Text className="text-label-sm text-muted">
              등록한 키워드의 접수가 시작되면 선착순 마감 전에 알려드립니다.
            </Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ true: Palette.brand, false: Palette.line }}
            accessibilityLabel="푸시 알림 사용"
          />
        </View>

        <View className="mt-sm border-t border-line pt-sm">
          <Text className="text-label-md font-semibold text-muted">관심 키워드</Text>
          <View className="mt-xs flex-row flex-wrap gap-xxs">
            {CATEGORIES.map((category) => (
              <FilterChip
                key={category.id}
                label={category.label}
                selected={interests.includes(category.id)}
                onPress={() => toggleInterest(category.id)}
              />
            ))}
          </View>
        </View>
      </Card>

      <View className="mt-lg">
        <SectionHeader title="받은 알림" />
        <View className="mt-xs gap-xs">
          {notifications.length ? (
            notifications.map((notification) => {
              const meta = KIND_META[notification.kind];
              return (
                <Card
                  key={notification.id}
                  className={notification.read ? '' : 'border-brand'}
                  onPress={() => {
                    readNotification(notification.id);
                    if (notification.href) router.push(notification.href);
                  }}>
                  <View className="flex-row items-start gap-sm">
                    <View className="h-[40px] w-[40px] items-center justify-center rounded-full bg-ice">
                      <Icon name={meta.icon} size={20} color={Palette.brand} />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-xxs">
                        <Badge label={meta.label} tone={meta.tone} />
                        <Text className="text-label-sm text-subtle">
                          {formatRelative(notification.createdAt)}
                        </Text>
                        {!notification.read ? (
                          <View className="h-[6px] w-[6px] rounded-full bg-accent" />
                        ) : null}
                      </View>
                      <Text
                        className={`mt-xxs text-body-md ${
                          notification.read ? 'font-medium text-muted' : 'font-semibold text-ink'
                        }`}>
                        {notification.title}
                      </Text>
                      <Text className="mt-xxs text-body-sm text-muted">{notification.body}</Text>
                    </View>
                  </View>
                </Card>
              );
            })
          ) : (
            <EmptyState icon="bell" title="받은 알림이 없습니다" />
          )}
        </View>
      </View>
    </Screen>
  );
}
