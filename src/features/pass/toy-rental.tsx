import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty';
import { ConfirmSheet } from '@/components/ui/sheet';
import { Palette } from '@/constants/design';
import { listToys } from '@/services/familynet';
import { useAppStore } from '@/store/app-store';
import type { Toy } from '@/types/domain';

const CONDITION_META = {
  available: { label: '대여 가능', tone: 'success' },
  rented: { label: '전량 대여중', tone: 'neutral' },
  repair: { label: '소독·수리중', tone: 'accent' },
} as const;

export function ToyRental() {
  const router = useRouter();
  const { selectedCenter, rentToy } = useAppStore();
  const [toys, setToys] = useState<Toy[]>([]);
  const [pending, setPending] = useState<Toy | null>(null);

  useEffect(() => {
    listToys(selectedCenter?.id).then(setToys);
  }, [selectedCenter?.id]);

  if (!toys.length) {
    return (
      <EmptyState
        icon="toy"
        title="이 센터는 장난감 도서관을 운영하지 않습니다"
        description="장난감도서관을 운영하는 센터를 선택하면 재고를 확인할 수 있습니다."
        action={
          <Button label="센터 변경" variant="outline" onPress={() => router.push('/center-select')} />
        }
      />
    );
  }

  return (
    <View className="gap-xs">
      <Card className="bg-brand-soft" accent="bg-brand">
        <View className="flex-row items-center gap-xs">
          <Icon name="qr" size={20} color={Palette.brand} />
          <Text className="flex-1 text-body-sm text-brand">
            대여 신청 후 발급되는 QR을 현장 키오스크에 태깅하면 대여·반납이 완료됩니다.
          </Text>
        </View>
      </Card>

      {toys.map((toy) => {
        const meta = CONDITION_META[toy.condition];
        const rentable = toy.available > 0 && toy.condition === 'available';
        return (
          <Card key={toy.id} className={rentable ? '' : 'opacity-70'}>
            <View className="flex-row items-start gap-sm">
              <View className="h-[52px] w-[52px] items-center justify-center rounded-md bg-accent-soft">
                <Icon name="toy" size={26} color={Palette.accent} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-xxs">
                  <Badge label={meta.label} tone={meta.tone} />
                  <Text className="text-label-sm text-subtle">{toy.category}</Text>
                </View>
                <Text className="mt-xxs text-body-md font-semibold text-ink">{toy.name}</Text>
                <Text className="text-label-sm text-muted">
                  권장 {toy.ageRange} · 대여 {toy.rentalDays}일
                </Text>
                <Text
                  className={`mt-xxs text-label-sm font-semibold ${
                    rentable ? 'text-success' : 'text-subtle'
                  }`}>
                  재고 {toy.available} / {toy.total}점
                </Text>
              </View>
            </View>
            <Button
              label={rentable ? '대여 신청' : '대여 불가'}
              variant={rentable ? 'primary' : 'ghost'}
              disabled={!rentable}
              className="mt-xs"
              onPress={() => setPending(toy)}
            />
          </Card>
        );
      })}

      <ConfirmSheet
        visible={pending !== null}
        title="장난감을 대여할까요?"
        description="대여 QR이 발급됩니다. 발급 후 3일 이내 방문하지 않으면 예약이 자동 취소됩니다."
        confirmLabel="대여하고 QR 받기"
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (!pending) return;
          const pass = rentToy(pending.id);
          setPending(null);
          if (pass) router.push(`/qr/${pass.id}`);
        }}>
        <Card className="bg-brand/5">
          <Text className="text-body-md font-semibold text-ink">{pending?.name}</Text>
          <Text className="mt-xxs text-label-sm text-muted">
            대여 기간 {pending?.rentalDays}일 · {selectedCenter?.name}
          </Text>
        </Card>
      </ConfirmSheet>
    </View>
  );
}
