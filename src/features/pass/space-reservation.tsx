import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Badge, FilterChip } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty';
import { ConfirmSheet } from '@/components/ui/sheet';
import { Palette } from '@/constants/design';
import { isoDate } from '@/mocks/data';
import { listSlots, listSpaces } from '@/services/familynet';
import { useAppStore } from '@/store/app-store';
import type { Space, TimeSlot } from '@/types/domain';
import { formatShortDate } from '@/utils/format';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const DAYS = Array.from({ length: 14 }, (_, i) => isoDate(i));

export function SpaceReservation() {
  const router = useRouter();
  const { selectedCenter, reserveSlot } = useAppStore();

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [spaceId, setSpaceId] = useState<string | null>(null);
  const [date, setDate] = useState(DAYS[0]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [pendingSlot, setPendingSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      const list = await listSpaces(selectedCenter?.id);
      setSpaces(list);
      setSpaceId(list[0]?.id ?? null);
    };
    fetchSpaces();
  }, [selectedCenter?.id]);

  useEffect(() => {
    const fetchSlots = async () => {
      setSlots(spaceId ? await listSlots(spaceId, date) : []);
    };
    fetchSlots();
  }, [spaceId, date]);

  const space = useMemo(() => spaces.find((s) => s.id === spaceId), [spaces, spaceId]);

  if (!spaces.length) {
    return (
      <EmptyState
        icon="calendar"
        title="이 센터에는 예약 가능한 공간이 없습니다"
        description="공동육아나눔터를 운영하는 다른 센터를 선택해 보세요."
        action={
          <Button label="센터 변경" variant="outline" onPress={() => router.push('/center-select')} />
        }
      />
    );
  }

  return (
    <View className="gap-md">
      {/* 공간 선택 */}
      <View>
        <Text className="text-title-lg font-semibold text-ink">공간 선택</Text>
        <View className="mt-xs flex-row flex-wrap gap-xxs">
          {spaces.map((item) => (
            <FilterChip
              key={item.id}
              label={item.name.replace(/^[가-힣]+\s/, '')}
              selected={item.id === spaceId}
              onPress={() => setSpaceId(item.id)}
            />
          ))}
        </View>
        {space ? (
          <Card className="mt-xs bg-white/75">
            <View className="flex-row items-center gap-xs">
              <Badge label={space.kind === 'care-share' ? '공동육아나눔터' : '장난감도서관'} tone="brand" />
              <Text className="text-label-sm text-subtle">정원 {space.capacity}명</Text>
            </View>
            <Text className="mt-xxs text-body-sm text-muted">{space.description}</Text>
          </Card>
        ) : null}
      </View>

      {/* 날짜 선택 */}
      <View>
        <Text className="text-title-lg font-semibold text-ink">날짜 선택</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 8 }}>
          {DAYS.map((day, index) => {
            const selected = day === date;
            const weekday = WEEKDAYS[new Date(`${day}T00:00:00`).getDay()];
            const weekend = weekday === '토' || weekday === '일';
            return (
              <Pressable
                key={day}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`${formatShortDate(day)} ${weekday}요일`}
                onPress={() => setDate(day)}
                className={`h-[64px] w-[52px] items-center justify-center rounded-md border ${
                  selected ? 'border-brand bg-brand' : 'border-white/70 bg-white/75'
                }`}>
                <Text
                  className={`text-label-sm ${
                    selected ? 'text-white' : weekend ? 'text-accent' : 'text-subtle'
                  }`}>
                  {index === 0 ? '오늘' : weekday}
                </Text>
                <Text
                  className={`mt-xxs text-body-md font-bold ${selected ? 'text-white' : 'text-ink'}`}>
                  {formatShortDate(day)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 시간대 */}
      <View>
        <Text className="text-title-lg font-semibold text-ink">이용 시간</Text>
        <View className="mt-xs gap-xs">
          {slots.length ? (
            slots.map((slot) => {
              const soldOut = slot.remaining === 0;
              return (
                <Card key={slot.id} className={soldOut ? 'opacity-60' : ''}>
                  <View className="flex-row items-center gap-sm">
                    <View className="h-[44px] w-[44px] items-center justify-center rounded-full bg-brand-soft">
                      <Icon name="clock" size={22} color={Palette.brand} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-body-lg font-semibold text-ink">
                        {slot.start} - {slot.end}
                      </Text>
                      <Text
                        className={`text-label-sm ${soldOut ? 'text-subtle' : 'text-success'}`}>
                        {soldOut ? '예약 마감' : `잔여 ${slot.remaining} / ${slot.capacity}명`}
                      </Text>
                    </View>
                    <Button
                      label={soldOut ? '마감' : '예약'}
                      variant={soldOut ? 'ghost' : 'primary'}
                      disabled={soldOut}
                      onPress={() => setPendingSlot(slot)}
                    />
                  </View>
                </Card>
              );
            })
          ) : (
            <EmptyState icon="clock" title="선택한 날짜에 운영 시간이 없습니다" />
          )}
        </View>
      </View>

      <ConfirmSheet
        visible={pendingSlot !== null}
        title="이 시간으로 예약할까요?"
        description="예약 확정 시 QR 스마트패스가 발급되며, 현장 키오스크에 태깅하면 출석이 처리됩니다."
        confirmLabel="예약하고 QR 받기"
        onCancel={() => setPendingSlot(null)}
        onConfirm={() => {
          if (!pendingSlot) return;
          const pass = reserveSlot(pendingSlot.id);
          setPendingSlot(null);
          if (pass) router.push(`/qr/${pass.id}`);
        }}>
        <Card className="bg-brand/5">
          <Text className="text-body-md font-semibold text-ink">{space?.name}</Text>
          <Text className="mt-xxs text-label-sm text-muted">
            {pendingSlot ? `${pendingSlot.date} ${pendingSlot.start} - ${pendingSlot.end}` : ''}
          </Text>
        </Card>
      </ConfirmSheet>
    </View>
  );
}
