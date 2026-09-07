import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CenterCard } from '@/components/center-card';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty';
import { MaxContentWidth, Palette } from '@/constants/design';
import { useAppStore } from '@/store/app-store';

export default function CenterSelectScreen() {
  const router = useRouter();
  const {
    nearbyCenters,
    selectedCenterId,
    favoriteCenterIds,
    locating,
    selectCenter,
    toggleFavorite,
    locate,
  } = useAppStore();
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(() => {
    const q = keyword.trim();
    if (!q) return nearbyCenters;
    return nearbyCenters.filter((center) =>
      `${center.name} ${center.district} ${center.region} ${center.address}`.includes(q)
    );
  }, [keyword, nearbyCenters]);

  const favorites = filtered.filter((c) => favoriteCenterIds.includes(c.id));
  const others = filtered.filter((c) => !favoriteCenterIds.includes(c.id));

  const choose = (centerId: string) => {
    selectCenter(centerId);
    router.back();
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-ice">
      <View className="h-[56px] flex-row items-center justify-between border-b border-line bg-canvas px-md">
        <Text className="text-title-lg font-semibold text-ink">센터 선택</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="닫기"
          onPress={() => router.back()}
          className="h-[40px] w-[40px] items-center justify-center active:opacity-60">
          <Icon name="close" size={20} color={Palette.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="w-full self-center px-md pt-md" style={{ maxWidth: MaxContentWidth }}>
          <View className="h-[44px] flex-row items-center gap-xs rounded border border-line bg-canvas px-sm">
            <Icon name="search" size={18} color={Palette.subtle} />
            <TextInput
              value={keyword}
              onChangeText={setKeyword}
              placeholder="지역 · 센터명으로 검색 (예: 마포)"
              placeholderTextColor={Palette.subtle}
              className="flex-1 text-body-md text-ink"
              accessibilityLabel="센터 검색"
            />
          </View>

          <Button
            label={locating ? '현재 위치 확인 중…' : '현재 위치로 다시 찾기'}
            variant="ghost"
            className="mt-xs"
            loading={locating}
            leading={<Icon name="pin" size={16} color={Palette.brand} />}
            onPress={locate}
          />

          {favorites.length ? (
            <View className="mt-lg">
              <Text className="text-title-lg font-semibold text-ink">즐겨찾기</Text>
              <View className="mt-xs gap-xs">
                {favorites.map((center) => (
                  <CenterCard
                    key={center.id}
                    center={center}
                    selected={center.id === selectedCenterId}
                    favorite
                    onPress={() => choose(center.id)}
                    onToggleFavorite={() => toggleFavorite(center.id)}
                  />
                ))}
              </View>
            </View>
          ) : null}

          <View className="mt-lg">
            <Text className="text-title-lg font-semibold text-ink">가까운 센터</Text>
            <Text className="mt-xxs text-label-sm text-subtle">
              현재 위치 기준 거리순으로 정렬됩니다.
            </Text>
            <View className="mt-xs gap-xs">
              {others.length ? (
                others.map((center) => (
                  <CenterCard
                    key={center.id}
                    center={center}
                    selected={center.id === selectedCenterId}
                    favorite={false}
                    onPress={() => choose(center.id)}
                    onToggleFavorite={() => toggleFavorite(center.id)}
                  />
                ))
              ) : (
                <EmptyState
                  title="검색 결과가 없습니다"
                  description="다른 지역명이나 센터명을 입력해 보세요."
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
