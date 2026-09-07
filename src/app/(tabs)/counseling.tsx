import { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Icon, type IconName } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { ConfirmSheet } from '@/components/ui/sheet';
import { Palette } from '@/constants/design';
import { COUNSELING_FIELDS, COUNSELORS, EMOTIONS } from '@/mocks/data';
import { useAppStore } from '@/store/app-store';
import type { Counselor, CounselingField } from '@/types/domain';

const HOTLINE = '1644-6621';

const MODE_META: Record<Counselor['modes'][number], { label: string; icon: IconName }> = {
  chat: { label: '비대면 채팅', icon: 'chat' },
  video: { label: '화상 솔루션', icon: 'video' },
  visit: { label: '센터 대면상담실', icon: 'pin' },
};

export default function CounselingScreen() {
  const { selectedCenter, emotion, setEmotion, requestCounseling, counselingRequests } =
    useAppStore();
  const [field, setField] = useState<CounselingField | 'all'>('all');
  const [booking, setBooking] = useState<Counselor | null>(null);
  const [chatSheet, setChatSheet] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const counselors = useMemo(
    () => COUNSELORS.filter((c) => field === 'all' || c.fields.includes(field)),
    [field]
  );
  const currentEmotion = EMOTIONS.find((e) => e.id === emotion) ?? EMOTIONS[2];
  const waiting = 12 + counselingRequests.length;

  const guarantees: { icon: IconName; title: string; sub: string; color: string }[] = [
    { icon: 'verified', title: '전액 무료 지원', sub: '국비 전액부담', color: '#FFF3EC' },
    { icon: 'video', title: '대면·비대면 택1', sub: '화상/채팅/방문', color: '#8BF8C3' },
    { icon: 'shield', title: '암호화 철저보호', sub: '공공보안 인증', color: '#EBF2FA' },
  ];

  return (
    <Screen header contentClassName="px-md">
      {/* 히어로 */}
      <View className="mt-sm overflow-hidden rounded-lg bg-brand-deep p-md">
        <View className="absolute -bottom-[24px] -right-[24px] h-[128px] w-[128px] rounded-full bg-white/5" />
        <View className="absolute -top-[32px] right-[40px] h-[96px] w-[96px] rounded-full bg-success/10" />
        <View className="mb-xs flex-row items-center gap-xs">
          <View className="flex-row items-center gap-xxs rounded-full bg-white/15 px-xs py-[3px]">
            <Icon name="shield" size={14} color="#E6F6F0" filled />
            <Text className="text-label-sm text-brand-soft">한국건강가정진흥원 공인</Text>
          </View>
          <Text className="text-label-sm text-[#A7C8FF]">KIHF 안심상담망</Text>
        </View>
        <Text className="text-headline-xl font-bold text-white">
          100% 비밀보장 국가공인{'\n'}
          <Text className="text-[#8BF8C3]">안심 1:1 맞춤 가족상담</Text>
        </Text>
        <Text className="mb-md mt-xs text-body-sm text-brand-soft">
          {selectedCenter?.name ?? '가족센터'} 전문상담사가 따뜻하고 안전하게 함께합니다.
        </Text>
        <View className="flex-row gap-xs">
          {guarantees.map((g) => (
            <View key={g.title} className="flex-1 items-center rounded bg-white/10 p-xs">
              <Icon name={g.icon} size={20} color={g.color} />
              <Text className="mt-xxs text-center text-label-sm font-semibold" style={{ color: g.color }}>
                {g.title}
              </Text>
              <Text className="text-[10px] font-normal text-ice/80">{g.sub}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 고민 분야 */}
      <View className="mt-md">
        <View className="mb-xs flex-row items-center justify-between">
          <Text className="text-title-lg font-semibold text-brand-deep">고민 맞춤 분야</Text>
          <Text className="text-label-sm text-muted">총 {waiting}명 대기중</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: field === 'all' }}
            onPress={() => setField('all')}
            className={`h-[40px] justify-center rounded-full px-md ${field === 'all' ? 'bg-brand' : 'bg-canvas border border-line'}`}>
            <Text className={`text-label-md font-semibold ${field === 'all' ? 'text-white' : 'text-muted'}`}>
              전체
            </Text>
          </Pressable>
          {COUNSELING_FIELDS.map((f) => {
            const selected = field === f.id;
            return (
              <Pressable
                key={f.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setField(f.id)}
                className={`h-[40px] flex-row items-center gap-xxs rounded-full px-md ${
                  selected ? 'bg-brand' : 'border border-line bg-canvas'
                }`}>
                <Icon name={f.icon} size={16} color={selected ? '#FFFFFF' : Palette.brand} />
                <Text className={`text-label-md font-semibold ${selected ? 'text-white' : 'text-muted'}`}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 상담사 카드 */}
      <View className="mt-md">
        <View className="mb-xs flex-row items-center justify-between">
          <View className="flex-row items-center gap-xxs">
            <Text className="text-title-lg font-semibold text-brand-deep">우리동네 공인 상담사</Text>
            <Badge label={`${selectedCenter?.district ?? '센터'} 직속`} tone="brand" />
          </View>
        </View>

        {done ? (
          <View className="mb-xs flex-row items-center gap-xs rounded-md border border-success bg-success-soft px-sm py-xs">
            <Icon name="check" size={18} color={Palette.success} />
            <Text className="flex-1 text-body-sm font-semibold text-success">{done}</Text>
          </View>
        ) : null}

        <View className="gap-sm">
          {counselors.map((c) => {
            const accent = c.availableToday ? 'bg-success' : 'bg-brand';
            return (
              <View key={c.id} className="overflow-hidden rounded-md border border-line bg-canvas">
                <View className="flex-row">
                  <View className={`w-[6px] ${accent}`} />
                  <View className="flex-1 p-md">
                    <View className="flex-row items-start gap-sm">
                      <View>
                        <Avatar name={c.name} size={56} />
                        <View
                          className={`absolute bottom-0 right-0 h-[14px] w-[14px] rounded-full border-2 border-canvas ${accent}`}
                        />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center gap-xs">
                          <Text className="text-title-lg font-bold text-brand-deep">{c.name}</Text>
                          <Badge label={c.license} tone={c.availableToday ? 'success' : 'brand'} />
                        </View>
                        <View className="mt-xxs flex-row items-center gap-xxs">
                          <Icon name="star" size={16} color={Palette.accentAmber} filled />
                          <Text className="text-body-sm font-bold text-ink">{c.rating.toFixed(2)}</Text>
                          <Text className="text-body-sm text-muted">
                            · 누적 {c.sessions.toLocaleString('ko-KR')}회 상담
                          </Text>
                        </View>
                        <Text numberOfLines={1} className="mt-xxs text-body-sm text-muted">
                          전문분야: {c.specialty}
                        </Text>
                      </View>
                    </View>

                    <View className="mt-sm flex-row flex-wrap gap-xs">
                      {c.modes.map((mode) => (
                        <View key={mode} className="flex-row items-center gap-xxs rounded bg-ice px-xs py-[3px]">
                          <Icon name={MODE_META[mode].icon} size={14} color={Palette.brand} />
                          <Text className="text-label-sm text-brand">{MODE_META[mode].label}</Text>
                        </View>
                      ))}
                      {c.availableToday ? (
                        <View className="flex-row items-center gap-xxs rounded bg-accent-soft px-xs py-[3px]">
                          <Icon name="clock" size={14} color={Palette.accent} />
                          <Text className="text-label-sm font-semibold text-accent">오늘 바로 가능</Text>
                        </View>
                      ) : null}
                      {c.note ? (
                        <View className="flex-row items-center gap-xxs rounded bg-brand-soft px-xs py-[3px]">
                          <Icon name="pin" size={14} color={Palette.brand} />
                          <Text className="text-label-sm text-brand">{c.note}</Text>
                        </View>
                      ) : null}
                    </View>

                    <Button
                      label={c.availableToday ? '1:1 안심 예약 신청 (무료)' : '상담 가능 일정 확인'}
                      variant={c.availableToday ? 'primary' : 'ghost'}
                      className="mt-sm"
                      leading={
                        <Icon
                          name={c.availableToday ? 'calendar' : 'clock'}
                          size={18}
                          color={c.availableToday ? '#FFFFFF' : Palette.brand}
                        />
                      }
                      onPress={() => setBooking(c)}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* 마음 날씨 */}
      <View className="mt-lg rounded-md bg-brand-soft/60 p-md">
        <View className="mb-xs flex-row items-center justify-between">
          <View className="flex-row items-center gap-xs">
            <Icon name="mood" size={22} color={Palette.accent} />
            <Text className="text-title-lg font-bold text-brand-deep">우리 가족 마음 날씨</Text>
          </View>
          <Text className="text-label-sm font-semibold text-brand">감정 다이어리</Text>
        </View>
        <Text className="mb-sm text-body-sm text-muted">
          지금 느껴지는 감정을 누르면 공공 힐링 프로그램이 즉시 추천됩니다.
        </Text>
        <View className="flex-row gap-xs">
          {EMOTIONS.map((e) => {
            const selected = e.id === currentEmotion.id;
            return (
              <Pressable
                key={e.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setEmotion(e.id)}
                className={`flex-1 items-center gap-xxs rounded p-xs ${
                  selected ? 'border-2 border-accent bg-accent-soft' : 'border border-line bg-canvas'
                }`}>
                <Text className="text-[26px]">{e.emoji}</Text>
                <Text
                  className={`text-center text-label-sm ${selected ? 'font-bold text-accent' : 'font-semibold text-brand-deep'}`}>
                  {e.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View className="mt-md flex-row items-center justify-between rounded bg-canvas p-sm">
          <View className="flex-1 flex-row items-center gap-sm">
            <View className="h-[40px] w-[40px] items-center justify-center rounded-full bg-accent-soft">
              <Icon name="heart" size={20} color={Palette.accent} filled />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-xxs">
                <Text className="text-label-sm font-bold text-accent">AI 맞춤 힐링</Text>
                <Text className="text-label-sm text-muted">· {currentEmotion.recommendation.tag}</Text>
              </View>
              <Text numberOfLines={1} className="text-label-md font-semibold text-brand-deep">
                {currentEmotion.recommendation.title}
              </Text>
            </View>
          </View>
          <View className="h-[32px] w-[32px] items-center justify-center rounded-full bg-ice">
            <Icon name="chevron-right" size={16} color={Palette.brand} />
          </View>
        </View>
      </View>

      {/* 24시간 핫라인 */}
      <View className="mt-md rounded-md bg-accent-soft p-md">
        <View className="mb-sm flex-row items-center justify-between">
          <View className="flex-row items-center gap-xs">
            <View className="h-[36px] w-[36px] items-center justify-center rounded-full bg-accent">
              <Icon name="phone" size={18} color="#FFFFFF" filled />
            </View>
            <View>
              <Text className="text-label-sm font-bold text-accent">24시간 365일 연중무휴</Text>
              <Text className="text-title-lg font-bold text-brand-deep">가족상담전화 {HOTLINE}</Text>
            </View>
          </View>
          <View className="rounded-full bg-accent/10 px-xs py-[3px]">
            <Text className="text-label-sm font-semibold text-accent">통화료 무료</Text>
          </View>
        </View>
        <View className="flex-row gap-xs">
          <Button
            label="지금 전화상담"
            variant="accent"
            className="flex-1"
            leading={<Icon name="phone" size={16} color="#FFFFFF" filled />}
            onPress={() => Linking.openURL(`tel:${HOTLINE}`)}
          />
          <Button
            label="비밀 채팅상담"
            variant="outline"
            className="flex-1"
            leading={<Icon name="chat" size={16} color={Palette.brand} />}
            onPress={() => setChatSheet(true)}
          />
        </View>
      </View>

      <ConfirmSheet
        visible={booking !== null}
        title={booking?.availableToday ? '1:1 안심 예약을 신청할까요?' : '상담 일정 확인을 요청할까요?'}
        description="상담 내용은 암호화되어 담당 상담사만 열람할 수 있습니다. 확정 일정은 알림으로 안내됩니다."
        confirmLabel="신청하기"
        onCancel={() => setBooking(null)}
        onConfirm={() => {
          if (!booking) return;
          requestCounseling(booking.id, booking.modes[0], booking.name);
          setDone(`${booking.name} 상담사에게 예약 신청이 접수되었습니다.`);
          setBooking(null);
        }}>
        {booking ? (
          <Card className="bg-ice">
            <View className="flex-row items-center gap-sm">
              <Avatar name={booking.name} size={40} />
              <View className="flex-1">
                <Text className="text-body-md font-semibold text-ink">
                  {booking.name} · {booking.license}
                </Text>
                <Text className="text-label-sm text-muted">
                  {booking.modes.map((m) => MODE_META[m].label).join(' · ')}
                </Text>
              </View>
            </View>
          </Card>
        ) : null}
      </ConfirmSheet>

      <ConfirmSheet
        visible={chatSheet}
        title="비밀 채팅상담 연결"
        description="익명 보안 채팅방이 열리며 담당 상담사가 배정되면 알림으로 안내합니다. 대화 기록은 상담 종료 후 30일 뒤 자동 삭제됩니다."
        confirmLabel="채팅상담 신청"
        onCancel={() => setChatSheet(false)}
        onConfirm={() => {
          requestCounseling(null, 'chat');
          setDone('비밀 채팅상담이 접수되었습니다. 상담사 배정 후 알림으로 안내드립니다.');
          setChatSheet(false);
        }}
      />
    </Screen>
  );
}
