import { useRouter, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { Barcode } from '@/components/barcode';
import { Icon, type IconName } from '@/components/icon';
import { InstitutionFooter } from '@/components/institution-footer';
import { ProgramCard } from '@/components/program-card';
import { FilterChip } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty';
import { Screen } from '@/components/ui/screen';
import { Palette } from '@/constants/design';
import { CAMPAIGN, CATEGORIES } from '@/mocks/data';
import { listPrograms, listSlots, listSpaces, listToys } from '@/services/familynet';
import { useAppStore } from '@/store/app-store';
import type { CategoryId, Program } from '@/types/domain';

const HOTLINE = '1644-6621';

interface ServiceTile {
  icon: IconName;
  iconBg: string;
  iconColor: string;
  badge: { label: string; bg: string; text: string };
  title: string;
  description: string;
  footer: string;
  footerColor: string;
  href: Href;
}

export default function HomeScreen() {
  const router = useRouter();
  const { locating, selectedCenter, user, passes, applications, interests } = useAppStore();

  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [urgent, setUrgent] = useState<Program | null>(null);
  const [todaySlots, setTodaySlots] = useState<number | null>(null);
  const [toyAvailable, setToyAvailable] = useState<number | null>(null);

  // 맞춤 지원 사업 목록
  useEffect(() => {
    listPrograms({
      centerId: selectedCenter?.id,
      categories: category === 'all' ? interests : [category],
      openOnly: true,
    }).then((list) => setPrograms(list.slice(0, 3)));
  }, [selectedCenter?.id, category, interests]);

  // 마감 임박 티커 + 서비스 타일 실시간 수치
  useEffect(() => {
    if (!selectedCenter) return;
    const centerId = selectedCenter.id;
    listPrograms({ centerId, openOnly: true }).then((list) => {
      setUrgent(list.find((p) => p.status === 'almost-full') ?? list[0] ?? null);
    });
    listSpaces(centerId).then(async (spaces) => {
      const today = new Date().toISOString().slice(0, 10);
      const slotLists = await Promise.all(spaces.map((space) => listSlots(space.id, today)));
      setTodaySlots(slotLists.flat().reduce((sum, slot) => sum + slot.remaining, 0));
    });
    listToys(centerId).then((toys) =>
      setToyAvailable(toys.reduce((sum, toy) => sum + toy.available, 0))
    );
  }, [selectedCenter]);

  const activePass = passes.find((p) => p.status === 'active');
  const toyRentals = passes.filter((p) => p.kind === 'toy' && p.status === 'active').length;
  const activeApplications = applications.filter((a) => a.status !== 'cancelled').length;

  const services: ServiceTile[] = [
    {
      icon: 'people',
      iconBg: 'bg-brand-soft',
      iconColor: Palette.brand,
      badge: { label: '당일예약', bg: 'bg-success-soft', text: 'text-success' },
      title: '공동육아나눔터',
      description: '품앗이 돌봄실 & 자조모임 공간 즉시 신청',
      footer: todaySlots == null ? '잔여 확인 중' : `오늘 여석 ${todaySlots}석`,
      footerColor: 'text-brand',
      href: '/reserve',
    },
    {
      icon: 'toy',
      iconBg: 'bg-accent-soft',
      iconColor: Palette.accent,
      badge: { label: '대여가능', bg: 'bg-brand-soft', text: 'text-brand' },
      title: '장난감 도서관',
      description: `${selectedCenter?.district ?? '우리동네'} 보유 교구 실시간 예약`,
      footer: toyAvailable == null ? '재고 확인 중' : `대여 가능 ${toyAvailable}점`,
      footerColor: 'text-accent',
      href: '/toys',
    },
    {
      icon: 'chat',
      iconBg: 'bg-ice',
      iconColor: '#2E194D',
      badge: { label: '비밀보장', bg: 'bg-brand-soft', text: 'text-brand' },
      title: '1:1 가족상담실',
      description: '부부·청소년·양육 전문 심리상담 전액 무료',
      footer: `전화 ${HOTLINE}`,
      footerColor: 'text-muted',
      href: '/counseling',
    },
    {
      icon: 'translate',
      iconBg: 'bg-success-soft',
      iconColor: Palette.success,
      badge: { label: '13개국어', bg: 'bg-accent-soft', text: 'text-accent' },
      title: '다문화 다누리',
      description: '생활 한국어 교실 & 행정 서류 무료 통번역',
      footer: '이지 한국어 서비스',
      footerColor: 'text-success',
      href: '/my',
    },
  ];

  const chipCategories = CATEGORIES.slice(0, 4);

  return (
    <Screen header contentClassName="px-md">
      {/* 기관 인증 배너 */}
      <View className="mt-xs flex-row items-center justify-between gap-xs rounded-md bg-brand-soft/70 p-sm">
        <View className="flex-1 flex-row items-center gap-xs">
          <View className="h-[32px] w-[32px] items-center justify-center rounded-full bg-canvas">
            <Icon name="heart" size={18} color={Palette.brand} filled />
          </View>
          <View className="flex-1">
            <Text className="text-label-sm font-bold text-brand">한국건강가정진흥원 인증</Text>
            <Text numberOfLines={1} className="text-label-sm text-muted">
              모든 가족이 존중받는 포용 사회
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-xxs rounded-full bg-success-soft px-xs py-[3px]">
          <View className="h-[6px] w-[6px] rounded-full bg-success" />
          <Text className="text-label-sm font-semibold text-success">
            {locating ? '센터 연결 중' : `${selectedCenter?.district ?? ''}센터 연동됨`}
          </Text>
        </View>
      </View>

      {/* 히어로: 디지털 가족패스 */}
      <View className="mt-sm overflow-hidden rounded-lg bg-brand p-lg">
        <View className="absolute -bottom-[32px] -right-[32px] h-[140px] w-[140px] rounded-full bg-white/10" />
        <View className="absolute right-[16px] top-[16px] h-[80px] w-[80px] rounded-full bg-accent/20" />

        <View className="flex-row items-start justify-between">
          <View>
            <View className="flex-row items-center gap-xs">
              <Text className="text-label-sm text-white/80">
                {selectedCenter?.district ?? '우리동네'} 가족패스
              </Text>
              <View className="rounded-full bg-accent px-xs py-[2px]">
                <Text className="text-label-sm font-semibold text-white">통합인증</Text>
              </View>
            </View>
            <Text className="mt-xxs text-title-lg font-bold text-white">
              {user.name} 님{' '}
              <Text className="text-body-sm font-normal text-brand-fixed">
                ({user.householdSize}인 가구)
              </Text>
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-label-sm text-white/70">발급기관</Text>
            <Text className="text-label-md font-medium text-white">여성가족부·KIHF</Text>
          </View>
        </View>

        <View className="mt-md flex-row items-center justify-between rounded bg-canvas p-sm">
          <View className="flex-1 gap-xxs">
            <View className="flex-row items-center gap-xxs">
              <Text className="text-label-sm text-muted">센터 간편 출입코드</Text>
              <Text className="text-label-sm font-semibold text-success">
                {activePass ? '유효' : '미발급'}
              </Text>
            </View>
            <Barcode code={activePass?.code ?? user.memberNo} width={170} height={28} />
            <Text className="text-label-sm tracking-[1px] text-muted">
              {activePass?.code ?? user.memberNo}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="QR 체크인 열기"
            onPress={() => router.push(activePass ? `/qr/${activePass.id}` : '/pass')}
            className="items-center justify-center gap-xxs rounded bg-accent px-sm py-xs active:opacity-80">
            <Icon name="scan" size={24} color="#FFFFFF" />
            <Text className="text-label-md font-semibold text-white">QR 체크인</Text>
          </Pressable>
        </View>

        <View className="mt-sm flex-row items-center justify-between">
          <View className="flex-row items-center gap-xxs">
            <Icon name="verified" size={14} color="#65D19F" filled />
            <Text className="text-label-sm text-brand-fixed">
              {user.memberType} 승인 완료 · 신청 {activeApplications}건
            </Text>
          </View>
          <View className="flex-row items-center gap-xxs">
            <Icon name="toy" size={14} color="#EBF2FA" />
            <Text className="text-label-sm text-brand-fixed">도서관 교구 대여권 ({toyRentals}/2)</Text>
          </View>
        </View>
      </View>

      {/* 마감 임박 티커 */}
      {urgent ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/program/${urgent.id}`)}
          className="mt-sm flex-row items-center gap-xs rounded bg-accent-soft px-sm py-xs active:opacity-80">
          <View className="rounded bg-accent px-xs py-[2px]">
            <Text className="text-label-sm font-bold text-white">마감임박</Text>
          </View>
          <Text numberOfLines={1} className="flex-1 text-body-sm text-ink">
            선착순 {Math.max(0, urgent.capacity - urgent.applied)}명! [{urgent.title}] 접수 중
          </Text>
          <Icon name="chevron-right" size={16} color={Palette.muted} />
        </Pressable>
      ) : null}

      {/* 주요 원스톱 서비스 */}
      <View className="mt-lg">
        <View className="mb-sm flex-row items-center justify-between">
          <View className="flex-row items-center gap-xxs">
            <View className="h-[16px] w-[4px] rounded-full bg-brand" />
            <Text className="text-title-lg font-bold text-brand-deep">주요 원스톱 서비스</Text>
          </View>
          <Text className="text-label-sm text-muted">공공 이용료 전액 지원</Text>
        </View>
        <View className="flex-row flex-wrap justify-between gap-y-xs">
          {services.map((tile) => (
            <Pressable
              key={tile.title}
              accessibilityRole="button"
              onPress={() => router.push(tile.href)}
              className="w-[48.5%] justify-between gap-sm rounded-md border border-line bg-canvas p-md active:bg-ice">
              <View className="flex-row items-start justify-between">
                <View className={`h-[40px] w-[40px] items-center justify-center rounded ${tile.iconBg}`}>
                  <Icon name={tile.icon} size={22} color={tile.iconColor} />
                </View>
                <View className={`rounded-full px-xs py-[2px] ${tile.badge.bg}`}>
                  <Text className={`text-label-sm font-medium ${tile.badge.text}`}>
                    {tile.badge.label}
                  </Text>
                </View>
              </View>
              <View>
                <Text className="text-label-md font-bold text-ink">{tile.title}</Text>
                <Text className="mt-xxs text-body-sm text-muted">{tile.description}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className={`text-label-sm font-semibold ${tile.footerColor}`}>
                  {tile.footer}
                </Text>
                <Icon name="arrow-right" size={16} color={tile.iconColor} />
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* 시즌 캠페인 배너 */}
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(`/program/${CAMPAIGN.programId}`)}
        className="mt-lg flex-row items-center justify-between gap-sm rounded-md bg-[#DAE3F2] p-md active:opacity-80">
        <View className="flex-1 gap-xxs">
          <View className="flex-row items-center gap-xxs">
            <View className="rounded-full bg-brand px-xs py-[2px]">
              <Text className="text-label-sm font-bold text-white">{CAMPAIGN.badge}</Text>
            </View>
            <Text className="text-label-sm text-muted">{CAMPAIGN.place}</Text>
          </View>
          <Text numberOfLines={1} className="text-title-lg font-bold text-brand-deep">
            {CAMPAIGN.title}
          </Text>
          <Text className="text-body-sm text-muted">{CAMPAIGN.description}</Text>
        </View>
        <View className="rounded bg-brand px-sm py-xs">
          <Text className="text-label-md font-semibold text-white">사전예약</Text>
        </View>
      </Pressable>

      {/* 우리 가족 맞춤 지원 사업 */}
      <View className="mt-xl">
        <View className="mb-sm flex-row items-center justify-between">
          <View className="flex-row items-center gap-xxs">
            <View className="h-[16px] w-[4px] rounded-full bg-accent" />
            <Text className="text-title-lg font-bold text-brand-deep">우리 가족 맞춤 지원 사업</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/programs')}
            className="flex-row items-center gap-xxs active:opacity-60">
            <Text className="text-label-sm text-muted">전체보기</Text>
            <Icon name="chevron-right" size={14} color={Palette.muted} />
          </Pressable>
        </View>
        <View className="flex-row flex-wrap gap-xxs">
          <FilterChip label="전체 보기" selected={category === 'all'} onPress={() => setCategory('all')} />
          {chipCategories.map((c) => (
            <FilterChip
              key={c.id}
              label={c.label}
              selected={category === c.id}
              onPress={() => setCategory(c.id)}
            />
          ))}
        </View>
        <View className="mt-sm gap-sm">
          {programs.length ? (
            programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                showCenter={false}
                onPress={() => router.push(`/program/${program.id}`)}
              />
            ))
          ) : (
            <EmptyState
              icon="calendar"
              title="모집 중인 프로그램이 없습니다"
              description="다른 분야를 선택하거나 전체 프로그램에서 확인해 보세요."
            />
          )}
        </View>
      </View>

      {/* 가족상담전화 */}
      <View className="mt-xl flex-row items-center justify-between rounded-md bg-[#2E194D] p-lg">
        <View className="flex-1 gap-xxs">
          <Text className="text-label-sm text-[#FFDBCF]">전국 365일 가족 위기 긴급지원</Text>
          <Text className="text-headline-xl font-bold text-white">가족상담전화 {HOTLINE}</Text>
          <Text className="mt-xxs text-body-sm text-brand-fixed">
            한부모 · 양육비 · 청소년부모 · 임신출산 원스톱 콜
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${HOTLINE} 바로 전화걸기`}
          onPress={() => Linking.openURL(`tel:${HOTLINE}`)}
          className="h-[48px] w-[48px] items-center justify-center rounded-full bg-accent active:opacity-80">
          <Icon name="phone" size={22} color="#FFFFFF" filled />
        </Pressable>
      </View>

      <InstitutionFooter />
    </Screen>
  );
}
