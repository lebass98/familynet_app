import { useRouter, type Href } from 'expo-router';
import { Linking, Pressable, ScrollView, Switch, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Icon, type IconName } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Palette } from '@/constants/design';
import { LANGUAGES, MULTICULTURAL_SERVICES } from '@/mocks/data';
import { useAppStore } from '@/store/app-store';
import { formatDate } from '@/utils/format';

const DANURI = '1577-1366';

export default function GlobalScreen() {
  const router = useRouter();
  const {
    user,
    selectedCenter,
    language,
    setLanguage,
    easyMode,
    setEasyMode,
    biometricEnabled,
    setBiometricEnabled,
    pushEnabled,
    applications,
    passes,
    counselingRequests,
    favoriteCenterIds,
  } = useAppStore();

  const activeApplications = applications.filter((a) => a.status !== 'cancelled').length;
  const activePasses = passes.filter((p) => p.status === 'active').length;
  const currentLanguage = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];
  const big = easyMode;

  const menu: { icon: IconName; title: string; sub: string; href?: Href; onPress?: () => void }[] = [
    {
      icon: 'card',
      title: '나의 스마트 가족 증명 카드',
      sub: '공공시설·도서관·체육센터 무료입장 패스',
      href: '/pass',
    },
    {
      icon: 'folder',
      title: '증명서 발급 및 수료증 보관함',
      sub: `교육 이수증 ${activeApplications}건, 상담확인서 ${counselingRequests.length}건 보관중`,
      href: '/programs',
    },
    {
      icon: 'megaphone',
      title: '다문화 긴급 재난·복지 알림 설정',
      sub: `${currentLanguage.label} 푸시 알림 수신 ${pushEnabled ? '동의됨' : '꺼짐'}`,
      href: '/alerts',
    },
    {
      icon: 'pin',
      title: '이용 센터 변경 및 관할지 조회',
      sub: `현재 지정: ${selectedCenter ? `${selectedCenter.region} ${selectedCenter.name}` : '미지정'} · 즐겨찾기 ${favoriteCenterIds.length}곳`,
      href: '/center-select',
    },
  ];

  return (
    <Screen header contentClassName="px-md">
      {/* 다누리 언어 선택 */}
      <View className="-mx-md bg-brand-soft/70 px-md py-xs">
        <View className="mb-xs flex-row items-center justify-between">
          <View className="flex-row items-center gap-xxs">
            <Icon name="translate" size={18} color={Palette.brand} />
            <Text className="text-label-sm font-bold text-brand-deep">
              다누리 글로벌 언어지원 ({LANGUAGES.length}개국어)
            </Text>
          </View>
          <Pressable accessibilityRole="button" className="flex-row items-center gap-xxs active:opacity-60">
            <Text className="text-label-sm font-semibold text-accent">전체보기</Text>
            <Icon name="chevron-right" size={12} color={Palette.accent} />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
          {LANGUAGES.map((l) => {
            const selected = l.code === language;
            return (
              <Pressable
                key={l.code}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setLanguage(l.code)}
                className={`h-[34px] flex-row items-center gap-xxs rounded-full px-sm ${
                  selected ? 'bg-brand' : 'bg-canvas border border-line'
                }`}>
                <Text className="text-[14px]">{l.flag}</Text>
                <Text className={`text-label-sm font-semibold ${selected ? 'text-white' : 'text-muted'}`}>
                  {l.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 프로필 + 이지 모드 */}
      <Card className="mt-sm gap-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-sm">
            <View>
              <Avatar name={user.name} size={48} />
              <View className="absolute bottom-0 right-0 h-[14px] w-[14px] rounded-full border-2 border-canvas bg-success" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-xs">
                <Text className={`font-bold text-brand-deep ${big ? 'text-headline-md' : 'text-title-lg'}`}>
                  {user.name}
                </Text>
                <Badge label={user.memberType} tone="brand" />
              </View>
              <Text numberOfLines={1} className={`text-muted ${big ? 'text-body-md' : 'text-body-sm'}`}>
                {selectedCenter?.name ?? '가족센터'} 등록가정 (가구원 {user.householdSize}명)
              </Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="생체인증 설정"
            onPress={() => setBiometricEnabled(!biometricEnabled)}
            className={`h-[36px] w-[36px] items-center justify-center rounded-full ${biometricEnabled ? 'bg-brand' : 'bg-ice'}`}>
            <Icon name="shield" size={18} color={biometricEnabled ? '#FFFFFF' : Palette.brand} filled={biometricEnabled} />
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between rounded bg-accent-soft p-sm">
          <View className="flex-1 flex-row items-center gap-xs">
            <View className="h-[32px] w-[32px] items-center justify-center rounded-full bg-accent">
              <Icon name="user" size={16} color="#FFFFFF" filled />
            </View>
            <View className="flex-1">
              <Text className={`font-bold text-brand-deep ${big ? 'text-body-lg' : 'text-label-md'}`}>
                다문화 이지 모드 (Easy Mode)
              </Text>
              <Text className={`text-[#AA3600] ${big ? 'text-body-md' : 'text-body-sm'}`}>
                그림과 큰 글씨 중심의 직관적 신청 화면
              </Text>
            </View>
          </View>
          <Switch
            value={easyMode}
            onValueChange={setEasyMode}
            trackColor={{ true: Palette.accent, false: Palette.line }}
            accessibilityLabel="이지 모드 사용"
          />
        </View>
      </Card>

      {/* 다누리 콜센터 */}
      <View className="mt-md overflow-hidden rounded-lg bg-brand p-md">
        <View className="mb-xs flex-row items-center justify-between">
          <View className="flex-1 flex-row flex-wrap items-center gap-xs">
            <View className="rounded-full bg-white/20 px-xs py-[3px]">
              <Text className="text-label-sm font-semibold text-white">공식 24시</Text>
            </View>
            <Text className="text-label-sm text-brand-soft">여성가족부 위탁 · 한국건강가정진흥원 운영</Text>
          </View>
          <Icon name="chat" size={26} color="rgba(255,255,255,0.4)" filled />
        </View>
        <Text className="text-body-sm text-[#DAE3F2]">다누리 콜센터 24시간 실시간 지원</Text>
        <View className="mt-xxs flex-row items-baseline gap-xs">
          <Text className="text-headline-xl font-bold text-white">{DANURI}</Text>
          <Text className="text-label-sm font-medium text-[#FFDBCF]">13개 언어 3자 통역</Text>
        </View>
        <View className="mt-sm flex-row gap-xs">
          <Button
            label="원터치 전화연결"
            variant="accent"
            className="flex-1"
            leading={<Icon name="phone" size={16} color="#FFFFFF" filled />}
            onPress={() => Linking.openURL(`tel:${DANURI}`)}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/counseling')}
            className="h-[44px] flex-1 flex-row items-center justify-center gap-xs rounded bg-white/15 active:bg-white/25">
            <Icon name="translate" size={16} color="#FFFFFF" />
            <Text className="text-label-md font-semibold text-white">AI 실시간 번역방</Text>
          </Pressable>
        </View>
      </View>

      {/* 나의 센터 활동 */}
      <Card className="mt-md">
        <View className="mb-sm flex-row items-center justify-between">
          <Text className="text-title-lg font-bold text-brand-deep">나의 센터 활동</Text>
          <Text className="text-label-sm text-muted">{selectedCenter?.name ?? ''} 실시간</Text>
        </View>
        <View className="flex-row gap-xs">
          {[
            { value: activeApplications, label: '접수완료', color: 'text-brand' },
            { value: activePasses, label: '패스 예약', color: 'text-success' },
            { value: counselingRequests.length, label: '상담 신청', color: 'text-accent' },
          ].map((stat) => (
            <View key={stat.label} className="flex-1 items-center rounded bg-ice p-sm">
              <Text className={`text-headline-md font-bold ${stat.color}`}>
                {stat.value}
                <Text className="text-label-sm font-normal text-muted"> 건</Text>
              </Text>
              <Text className="mt-xxs text-label-sm text-muted">{stat.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* 진행 중인 맞춤 서비스 */}
      <View className="mt-lg">
        <View className="mb-xs flex-row items-center justify-between">
          <Text className="text-title-lg font-bold text-brand-deep">진행 중인 맞춤 서비스</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/programs')}
            className="flex-row items-center active:opacity-60">
            <Text className="text-label-sm text-muted">전체내역</Text>
            <Icon name="chevron-right" size={14} color={Palette.muted} />
          </Pressable>
        </View>
        <View className="gap-xs">
          {MULTICULTURAL_SERVICES.map((svc) => (
            <Card key={svc.id} className="gap-sm">
              <View className="flex-row items-start justify-between gap-xs">
                <View className="flex-1">
                  <View className="mb-xxs flex-row items-center gap-xs">
                    {svc.kind === 'language-dev' && svc.nextSession ? (
                      <Badge label="D-3" tone="accent" />
                    ) : (
                      <Badge
                        label={`출석률 ${Math.round(((svc.progressDone ?? 0) / (svc.progressTotal ?? 1)) * 100)}%`}
                        tone="success"
                      />
                    )}
                    <Text className="text-label-sm text-muted">{svc.tag}</Text>
                  </View>
                  <Text className={`font-bold text-brand-deep ${big ? 'text-headline-md' : 'text-title-lg'}`}>
                    {svc.title}
                  </Text>
                  <Text className="mt-xxs text-body-sm text-muted">{svc.subtitle}</Text>
                </View>
                <View className="h-[40px] w-[40px] items-center justify-center rounded bg-ice">
                  <Icon
                    name={svc.kind === 'language-dev' ? 'megaphone' : 'programs'}
                    size={22}
                    color={svc.kind === 'language-dev' ? Palette.brand : Palette.success}
                  />
                </View>
              </View>

              {svc.kind === 'language-dev' && svc.nextSession ? (
                <View className="flex-row items-center justify-between rounded bg-ice p-sm">
                  <View className="flex-1 flex-row items-center gap-xs">
                    <Icon name="calendar" size={18} color={Palette.brand} />
                    <View className="flex-1">
                      <Text className="text-label-sm font-semibold text-brand-deep">
                        다음 세션: {formatDate(svc.nextSession.slice(0, 10))} {svc.nextSession.slice(11)}
                      </Text>
                      <Text className="text-body-sm text-muted">{svc.place}</Text>
                    </View>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push('/reserve')}
                    className="rounded bg-canvas px-sm py-xxs active:opacity-70">
                    <Text className="text-label-sm font-semibold text-brand">일정 변경</Text>
                  </Pressable>
                </View>
              ) : null}

              {svc.progressTotal ? (
                <View className="gap-xxs">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-label-sm text-muted">
                      전체 {svc.progressTotal}회차 중{' '}
                      <Text className="font-bold text-brand-deep">{svc.progressDone}회 완료</Text>
                    </Text>
                    <Text className="text-label-sm font-bold text-success">
                      {svc.progressTotal - (svc.progressDone ?? 0)}회 남음
                    </Text>
                  </View>
                  <View className="h-[8px] w-full overflow-hidden rounded-full bg-ice">
                    <View
                      className="h-full rounded-full bg-success"
                      style={{ width: `${((svc.progressDone ?? 0) / svc.progressTotal) * 100}%` }}
                    />
                  </View>
                  <View className="mt-xxs flex-row items-center justify-between">
                    <View className="flex-row items-center gap-xxs">
                      <Icon name="verified" size={14} color={Palette.muted} />
                      <Text className="text-label-sm text-muted">수료 시 국적·영주권 가점 부여</Text>
                    </View>
                    <Text className="text-label-sm font-bold text-brand">출결 현황 보기 →</Text>
                  </View>
                </View>
              ) : null}
            </Card>
          ))}
        </View>
      </View>

      {/* 유틸리티 카드 */}
      <View className="mt-md flex-row gap-sm">
        <Card className="flex-1 justify-between" onPress={() => router.push('/pass')}>
          <View>
            <View className="mb-xs h-[40px] w-[40px] items-center justify-center rounded bg-brand-soft">
              <Icon name="people" size={22} color={Palette.brand} />
            </View>
            <Text className="text-title-lg font-bold text-brand-deep">자조모임 소통</Text>
            <Text className="mt-xxs text-body-sm text-muted">베트남·필리핀 등 국가별 가족 교류 커뮤니티</Text>
          </View>
          <View className="mt-sm flex-row items-center gap-xxs">
            <Text className="text-label-sm font-bold text-brand">모임 12개 활동중</Text>
            <Icon name="arrow-right" size={14} color={Palette.brand} />
          </View>
        </Card>
        <Card className="flex-1 justify-between" onPress={() => Linking.openURL('https://www.liveinkorea.kr')}>
          <View>
            <View className="mb-xs h-[40px] w-[40px] items-center justify-center rounded bg-accent-soft">
              <Icon name="card" size={22} color={Palette.accent} />
            </View>
            <Text className="text-title-lg font-bold text-brand-deep">체류·비자 가이드</Text>
            <Text className="mt-xxs text-body-sm text-muted">F-6, F-2 등 비자 연장 및 출입국 민원 안내</Text>
          </View>
          <View className="mt-sm flex-row items-center gap-xxs">
            <Text className="text-label-sm font-bold text-accent">다누리포털 안내서</Text>
            <Icon name="arrow-right" size={14} color={Palette.accent} />
          </View>
        </Card>
      </View>

      {/* 마이 서랍 */}
      <View className="mt-lg overflow-hidden rounded-md border border-line bg-canvas">
        <View className="px-md pb-xs pt-md">
          <Text className="text-title-lg font-bold text-brand-deep">마이 서랍 및 모바일 증명</Text>
        </View>
        {menu.map((item, index) => (
          <Pressable
            key={item.title}
            accessibilityRole="button"
            onPress={() => (item.href ? router.push(item.href) : item.onPress?.())}
            className={`flex-row items-center justify-between px-md py-sm active:bg-ice ${
              index === 0 ? '' : 'border-t border-line'
            }`}>
            <View className="flex-1 flex-row items-center gap-sm">
              <View className="h-[36px] w-[36px] items-center justify-center rounded-full bg-ice">
                <Icon name={item.icon} size={18} color={Palette.brand} />
              </View>
              <View className="flex-1">
                <Text className={`text-brand-deep ${big ? 'text-body-lg font-semibold' : 'text-label-md'}`}>
                  {item.title}
                </Text>
                <Text numberOfLines={1} className="text-body-sm text-muted">
                  {item.sub}
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={18} color={Palette.subtle} />
          </Pressable>
        ))}
      </View>

      {/* 기관 푸터 */}
      <View className="mt-md gap-sm rounded-md bg-brand-soft/60 p-md">
        <View className="flex-row items-center gap-xs">
          <View className="h-[24px] w-[24px] items-center justify-center rounded-full bg-brand">
            <Icon name="home" size={12} color="#FFFFFF" filled />
          </View>
          <View>
            <Text className="text-label-sm font-bold text-brand-deep">한국건강가정진흥원 (KIHF)</Text>
            <Text className="text-body-sm text-muted">KOREAN INSTITUTE FOR HEALTHY FAMILY</Text>
          </View>
        </View>
        <Text className="text-body-sm leading-[20px] text-muted">
          본 모바일 포털은 여성가족부 지정 공공위탁 서비스로, 전국 244개 가족센터 및 다누리 글로벌
          네트워크와 실시간 연동되어 다문화 가족의 포용적 정착을 지원합니다.
        </Text>
        <View className="flex-row flex-wrap items-center gap-x-sm gap-y-xxs">
          <Text className="text-label-sm font-semibold text-brand-deep">개인정보처리방침</Text>
          <Text className="text-label-sm text-subtle">·</Text>
          <Text className="text-label-sm text-muted">이용약관</Text>
          <Text className="text-label-sm text-subtle">·</Text>
          <Text className="text-label-sm text-muted">다누리포털(Danuri)</Text>
          <Text className="text-label-sm text-subtle">·</Text>
          <Text className="text-label-sm text-muted">고객만족센터</Text>
        </View>
        <Text className="text-label-sm text-subtle">© Korean Institute for Healthy Family. All Rights Reserved.</Text>
        <Text className="text-label-sm text-subtle">가족센터 패밀리넷 앱 v1.0.0 (시연용)</Text>
      </View>
    </Screen>
  );
}
