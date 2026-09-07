import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Palette } from '@/constants/design';
import type { Center } from '@/types/domain';
import { formatDistance } from '@/utils/format';

const FACILITY_LABEL = {
  'care-share': '공동육아나눔터',
  'toy-library': '장난감도서관',
  counseling: '가족상담',
} as const;

export function CenterCard({
  center,
  selected,
  favorite,
  onPress,
  onToggleFavorite,
}: {
  center: Center;
  selected?: boolean;
  favorite?: boolean;
  onPress: () => void;
  onToggleFavorite?: () => void;
}) {
  return (
    <Card onPress={onPress} className={selected ? 'border-brand' : ''}>
      <View className="flex-row items-start gap-xs">
        <View className="flex-1">
          <View className="flex-row items-center gap-xxs">
            <Icon name="pin" size={16} color={Palette.brand} />
            <Text className="text-label-sm font-semibold text-brand">
              {center.region} {center.district}
            </Text>
            {center.distanceKm != null ? (
              <Text className="text-label-sm text-subtle">
                · {formatDistance(center.distanceKm)}
              </Text>
            ) : null}
          </View>
          <Text className="mt-xxs text-title-lg font-semibold text-ink">{center.name}</Text>
          <Text numberOfLines={1} className="mt-xxs text-body-sm text-muted">
            {center.address}
          </Text>
        </View>

        {onToggleFavorite ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={favorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            onPress={onToggleFavorite}
            hitSlop={8}
            className="h-[36px] w-[36px] items-center justify-center active:opacity-60">
            <Icon name="star" size={22} filled={favorite} color={favorite ? Palette.accentAmber : Palette.subtle} />
          </Pressable>
        ) : null}
      </View>

      <View className="mt-xs flex-row flex-wrap gap-xxs">
        {center.facilities.map((f) => (
          <Badge key={f} label={FACILITY_LABEL[f]} tone="neutral" />
        ))}
        {selected ? <Badge label="우리동네 센터" tone="brand" /> : null}
      </View>
    </Card>
  );
}
