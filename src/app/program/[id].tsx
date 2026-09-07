import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AmbientBackground } from '@/components/ui/glass';

import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CapacityBar } from '@/components/ui/progress';
import { DetailHeader } from '@/components/ui/screen';
import { ConfirmSheet } from '@/components/ui/sheet';
import { MaxContentWidth, Palette, ShadowRaised } from '@/constants/design';
import { CATEGORIES } from '@/mocks/data';
import { getCenterSync, getProgramSync } from '@/services/familynet';
import { useAppStore } from '@/store/app-store';
import { STATUS_LABEL, deadlineLabel, formatDate, formatFee } from '@/utils/format';

const TONE_BY_STATUS = {
  upcoming: 'brand',
  open: 'success',
  'almost-full': 'accent',
  closed: 'neutral',
} as const;

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isApplied, applyProgram, cancelApplication, biometricEnabled } = useAppStore();
  const [sheet, setSheet] = useState<'apply' | 'cancel' | null>(null);
  const [justApplied, setJustApplied] = useState(false);

  const program = useMemo(() => (id ? getProgramSync(id) : undefined), [id]);
  const center = program ? getCenterSync(program.centerId) : undefined;
  const category = CATEGORIES.find((c) => c.id === program?.category);

  if (!program) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-[#EEF3FA]">
      <AmbientBackground />
        <DetailHeader title="프로그램" onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center px-md">
          <Text className="text-body-lg text-muted">프로그램 정보를 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const applied = isApplied(program.id);
  const closed = program.status === 'closed';
  const full = program.applied >= program.capacity;

  const infoRows: [string, string][] = [
    ['접수기간', `${formatDate(program.applyStart)} ~ ${formatDate(program.applyEnd)}`],
    ['운영일정', program.schedule],
    ['장소', program.place],
    ['대상', program.target],
    ['참가비', formatFee(program.fee)],
    ['정원', `${program.capacity}명`],
  ];

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#EEF3FA]">
      <AmbientBackground />
      <DetailHeader title={center?.name ?? '프로그램'} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="w-full self-center px-md pt-md" style={{ maxWidth: MaxContentWidth }}>
          <View className="flex-row items-center gap-xxs">
            <Badge label={STATUS_LABEL[program.status]} tone={TONE_BY_STATUS[program.status]} />
            {category ? <Badge label={category.label} tone="neutral" /> : null}
            <View className="flex-1" />
            <Text className={`text-label-md font-bold ${closed ? 'text-subtle' : 'text-accent'}`}>
              {deadlineLabel(program.applyEnd)}
            </Text>
          </View>

          <Text className="mt-xs text-headline-xl font-bold text-ink">{program.title}</Text>
          <Text className="mt-xxs text-body-md text-muted">{program.summary}</Text>

          {justApplied ? (
            <View className="mt-md flex-row items-center gap-xs rounded-md border border-success bg-success-soft px-sm py-xs">
              <Icon name="check" size={18} color={Palette.success} />
              <Text className="flex-1 text-body-sm font-semibold text-success">
                신청이 접수되었습니다. 마이 화면의 신청 내역에서 확인할 수 있습니다.
              </Text>
            </View>
          ) : null}

          <Card className="mt-md">
            <CapacityBar applied={program.applied} capacity={program.capacity} />
          </Card>

          <Card className="mt-xs">
            {infoRows.map(([label, value], index) => (
              <View
                key={label}
                className={`flex-row gap-sm py-xs ${index === 0 ? '' : 'border-t border-brand/10'}`}>
                <Text className="w-[72px] text-label-md text-subtle">{label}</Text>
                <Text className="flex-1 text-body-sm text-ink">{value}</Text>
              </View>
            ))}
          </Card>

          <Card className="mt-xs">
            <Text className="text-title-lg font-semibold text-ink">프로그램 안내</Text>
            <Text className="mt-xs text-body-md text-muted">{program.description}</Text>
          </Card>

          {center ? (
            <Card className="mt-xs" onPress={() => router.push('/center-select')}>
              <View className="flex-row items-center gap-sm">
                <View className="h-[40px] w-[40px] items-center justify-center rounded-full bg-brand-soft">
                  <Icon name="pin" size={20} color={Palette.brand} />
                </View>
                <View className="flex-1">
                  <Text className="text-body-md font-semibold text-ink">{center.name}</Text>
                  <Text numberOfLines={1} className="text-label-sm text-muted">
                    {center.address}
                  </Text>
                </View>
                <Icon name="chevron-right" size={18} color={Palette.subtle} />
              </View>
            </Card>
          ) : null}

          <Text className="mt-md text-label-sm text-subtle">
            {biometricEnabled
              ? '생체인증 자동 로그인이 켜져 있어 추가 본인확인 없이 신청됩니다.'
              : '마이 화면의 설정에서 생체인증을 켜면 신청 시 본인확인 절차가 생략됩니다.'}
          </Text>
        </View>
      </ScrollView>

      {/* 하단 고정 CTA */}
      <View className="border-t border-brand/10 bg-white/75 px-md py-sm" style={ShadowRaised}>
        <View className="w-full self-center" style={{ maxWidth: MaxContentWidth }}>
          {closed ? (
            <Button label="접수가 마감되었습니다" disabled onPress={() => {}} size="lg" />
          ) : applied ? (
            <View className="flex-row gap-xs">
              <Button
                label="신청 취소"
                variant="outline"
                size="lg"
                className="flex-1"
                onPress={() => setSheet('cancel')}
              />
              <Button
                label="신청 완료됨"
                variant="ghost"
                size="lg"
                className="flex-1"
                disabled
                onPress={() => {}}
              />
            </View>
          ) : (
            <Button
              label={full ? '대기 신청하기' : '신청하기'}
              variant={full ? 'accent' : 'primary'}
              size="lg"
              onPress={() => setSheet('apply')}
            />
          )}
        </View>
      </View>

      <ConfirmSheet
        visible={sheet === 'apply'}
        title={full ? '대기 신청하시겠습니까?' : '이 프로그램을 신청하시겠습니까?'}
        description={
          full
            ? '정원이 마감되어 대기자로 등록됩니다. 결원 발생 시 푸시로 알려드립니다.'
            : '신청 정보는 센터 담당자에게 전달되며, 확정 결과는 알림으로 안내됩니다.'
        }
        confirmLabel={full ? '대기 신청' : '신청하기'}
        onCancel={() => setSheet(null)}
        onConfirm={() => {
          applyProgram(program.id);
          setSheet(null);
          setJustApplied(true);
        }}>
        <Card className="bg-brand/5">
          <Text className="text-body-md font-semibold text-ink">{program.title}</Text>
          <Text className="mt-xxs text-label-sm text-muted">
            {program.schedule} · {formatFee(program.fee)}
          </Text>
        </Card>
      </ConfirmSheet>

      <ConfirmSheet
        visible={sheet === 'cancel'}
        title="신청을 취소하시겠습니까?"
        description="취소 후에는 잔여 자리가 있을 때만 다시 신청할 수 있습니다."
        confirmLabel="신청 취소"
        tone="accent"
        onCancel={() => setSheet(null)}
        onConfirm={() => {
          cancelApplication(program.id);
          setSheet(null);
          setJustApplied(false);
        }}
      />
    </SafeAreaView>
  );
}
