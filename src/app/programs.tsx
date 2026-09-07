import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Switch, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ProgramCard } from '@/components/program-card';
import { FilterChip } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty';
import { DetailHeader, Screen } from '@/components/ui/screen';
import { Palette } from '@/constants/design';
import { CATEGORIES } from '@/mocks/data';
import { listPrograms } from '@/services/familynet';
import { useAppStore } from '@/store/app-store';
import type { CategoryId, Program } from '@/types/domain';

export default function ProgramsScreen() {
  const router = useRouter();
  const { selectedCenter, favoriteCenterIds } = useAppStore();

  const [keyword, setKeyword] = useState('');
  const [categories, setCategories] = useState<CategoryId[]>([]);
  const [openOnly, setOpenOnly] = useState(true);
  const [nearbyOnly, setNearbyOnly] = useState(true);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchPrograms = async () => {
      setLoading(true);
      const list = await listPrograms({
        centerId: nearbyOnly ? selectedCenter?.id : undefined,
        categories,
        keyword,
        openOnly,
      });
      if (cancelled) return;
      setPrograms(list);
      setLoading(false);
    };
    fetchPrograms();
    return () => {
      cancelled = true;
    };
  }, [categories, keyword, openOnly, nearbyOnly, selectedCenter?.id]);

  const scopeLabel = useMemo(() => {
    if (!nearbyOnly) return '전국 가족센터';
    return selectedCenter?.name ?? '우리동네 센터';
  }, [nearbyOnly, selectedCenter]);

  const toggleCategory = (id: CategoryId) =>
    setCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  return (
    <Screen contentClassName="px-md" topBar={<DetailHeader title="프로그램" onBack={() => router.back()} />}>
      <View className="py-sm">
        <Text className="text-body-sm text-muted">
          {scopeLabel} · 총 {programs.length}건
        </Text>
      </View>

      {/* 검색 */}
      <View className="h-[44px] flex-row items-center gap-xs rounded border border-line bg-canvas px-sm">
        <Icon name="search" size={18} color={Palette.subtle} />
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder="프로그램명 · 대상으로 검색"
          placeholderTextColor={Palette.subtle}
          className="flex-1 text-body-md text-ink"
          returnKeyType="search"
          accessibilityLabel="프로그램 검색"
        />
        {keyword ? (
          <Pressable accessibilityRole="button" accessibilityLabel="검색어 지우기" onPress={() => setKeyword('')} hitSlop={8}>
            <Icon name="close" size={16} color={Palette.subtle} />
          </Pressable>
        ) : null}
      </View>

      {/* 카테고리 필터 */}
      <View className="mt-xs flex-row flex-wrap gap-xxs">
        <FilterChip label="전체" selected={categories.length === 0} onPress={() => setCategories([])} />
        {CATEGORIES.map((category) => (
          <FilterChip
            key={category.id}
            label={category.label}
            selected={categories.includes(category.id)}
            onPress={() => toggleCategory(category.id)}
          />
        ))}
      </View>

      {/* 보기 옵션 */}
      <View className="mt-xs flex-row items-center justify-between rounded-md border border-line bg-canvas px-sm py-xs">
        <View className="flex-row items-center gap-xxs">
          <Text className="text-label-md text-muted">모집중만</Text>
          <Switch
            value={openOnly}
            onValueChange={setOpenOnly}
            trackColor={{ true: Palette.brand, false: Palette.line }}
            accessibilityLabel="모집중인 프로그램만 보기"
          />
        </View>
        <View className="h-[20px] w-[1px] bg-line" />
        <View className="flex-row items-center gap-xxs">
          <Text className="text-label-md text-muted">우리동네만</Text>
          <Switch
            value={nearbyOnly}
            onValueChange={setNearbyOnly}
            trackColor={{ true: Palette.brand, false: Palette.line }}
            accessibilityLabel="우리동네 센터 프로그램만 보기"
          />
        </View>
      </View>

      {favoriteCenterIds.length > 1 && nearbyOnly ? (
        <Text className="mt-xs text-label-sm text-subtle">
          즐겨찾기한 센터 {favoriteCenterIds.length}곳 중 「{selectedCenter?.name}」 기준으로 표시
          중입니다.
        </Text>
      ) : null}

      {/* 목록 */}
      <View className="mt-md gap-xs">
        {loading ? (
          <View className="items-center py-xl">
            <ActivityIndicator color={Palette.brand} />
          </View>
        ) : programs.length ? (
          programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              showCenter={!nearbyOnly}
              onPress={() => router.push(`/program/${program.id}`)}
            />
          ))
        ) : (
          <EmptyState
            title="조건에 맞는 프로그램이 없습니다"
            description="검색어를 지우거나 '모집중만' 옵션을 해제해 보세요."
          />
        )}
      </View>
    </Screen>
  );
}
