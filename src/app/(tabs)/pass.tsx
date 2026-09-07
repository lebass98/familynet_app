import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Platform, Pressable, Text, View } from 'react-native';

import { Barcode } from '@/components/barcode';
import { Icon } from '@/components/icon';
import { QrCode } from '@/components/qr-code';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty';
import { Screen } from '@/components/ui/screen';
import { ConfirmSheet } from '@/components/ui/sheet';
import { Palette } from '@/constants/design';
import { PUMASI_GROUPS } from '@/mocks/data';
import { listToys } from '@/services/familynet';
import { useAppStore } from '@/store/app-store';
import type { Toy } from '@/types/domain';
import { daysUntil, formatDate } from '@/utils/format';

const PASS_TTL = 180;

/** 코드 문자열을 바코드 표기용 16자리 숫자로 변환 (시연용) */
function barcodeDigits(code: string) {
  let seed = 0;
  for (let i = 0; i < code.length; i += 1) seed = (seed * 31 + code.charCodeAt(i)) >>> 0;
  let digits = '';
  while (digits.length < 16) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    digits += String(seed % 10);
  }
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatTimer(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function SmartPassScreen() {
  const router = useRouter();
  const { user, selectedCenter, passes, checkInPass, rentToy, joinedGroupIds, toggleGroup } =
    useAppStore();

  const [timer, setTimer] = useState(PASS_TTL - 5);
  const [bright, setBright] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [toys, setToys] = useState<Toy[]>([]);
  const [pendingToy, setPendingToy] = useState<Toy | null>(null);
  const [notifyToyIds, setNotifyToyIds] = useState<string[]>([]);
  const [extended, setExtended] = useState(false);
  const [createGroup, setCreateGroup] = useState(false);

  const activePass = passes.find((p) => p.status === 'active');
  const spacePass = passes.find((p) => p.kind === 'space' && p.status === 'active');
  const toyPass = passes.find((p) => p.kind === 'toy' && p.status === 'active');
  const groups = PUMASI_GROUPS.filter((g) => !selectedCenter || g.centerId === selectedCenter.id);

  // 인증 유효시간 카운트다운 (만료 시 자동 갱신)
  useEffect(() => {
    const id = setInterval(() => setTimer((t) => (t <= 1 ? PASS_TTL : t - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    listToys(selectedCenter?.id).then((list) => setToys(list.slice(0, 3)));
  }, [selectedCenter?.id]);

  const handleCheckIn = () => {
    if (!activePass) {
      router.push('/reserve');
      return;
    }
    checkInPass(activePass.id);
    setCheckedIn(true);
    setTimeout(() => setCheckedIn(false), 3000);
  };

  const openDirections = () => {
    if (!selectedCenter) return;
    const query = encodeURIComponent(selectedCenter.address);
    const url =
      Platform.OS === 'ios'
        ? `maps:0,0?q=${query}`
        : `https://map.naver.com/v5/search/${query}`;
    Linking.openURL(url).catch(() => {});
  };

  const passCode = activePass?.code ?? user.memberNo;

  return (
    <Screen header contentClassName="px-md">
      {/* 타이틀 */}
      <View className="mt-sm flex-row items-center justify-between">
        <View className="flex-row items-center gap-xxs">
          <Icon name="card" size={20} color={Palette.brand} />
          <Text className="text-label-md font-semibold text-brand-deep">KIHF 공공인증 모바일패스</Text>
        </View>
        <View className="flex-row items-center gap-xxs rounded-full bg-success-soft px-xs py-[3px]">
          <Icon name="shield" size={13} color={Palette.success} />
          <Text className="text-label-sm font-semibold text-success">통합인증 정상</Text>
        </View>
      </View>

      {/* 스마트패스 메인 카드 */}
      <View className={`mt-xs rounded-lg border border-line p-md ${bright ? 'bg-canvas' : 'bg-brand-soft/60'}`}>
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <View className="flex-row items-center gap-xs">
              <Text className="text-title-lg font-bold text-brand-deep">{user.name}</Text>
              <Badge label={`${user.memberType} (${user.householdSize}인 가족)`} tone="brand" />
            </View>
            <Text className="mt-xxs text-body-sm text-muted">
              회원번호: <Text className="font-medium text-brand-deep">{user.memberNo}</Text> · 유효기간{' '}
              {user.validUntil.replace(/-/g, '.')}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: bright }}
            onPress={() => setBright((v) => !v)}
            className={`flex-row items-center gap-xxs rounded px-xs py-xxs active:opacity-70 ${
              bright ? 'bg-accent' : 'bg-[#E0E9F8]'
            }`}>
            <Icon name="brightness" size={16} color={bright ? '#FFFFFF' : Palette.brand} />
            <Text className={`text-label-sm font-semibold ${bright ? 'text-white' : 'text-brand'}`}>
              {bright ? '자동 밝기' : '밝기 최대'}
            </Text>
          </Pressable>
        </View>

        <View className="mt-md items-center overflow-hidden rounded-md bg-canvas p-md">
          <View className="absolute -right-[32px] -top-[32px] h-[96px] w-[96px] rounded-full bg-brand/5" />
          <View className="relative">
            <QrCode code={passCode} size={144} />
            <View className="absolute inset-0 items-center justify-center">
              <View className="h-[28px] w-[28px] items-center justify-center rounded-full bg-accent">
                <View className="h-[12px] w-[12px] rounded-full bg-canvas" />
              </View>
            </View>
          </View>
          <View className="mt-sm items-center">
            <Barcode code={passCode} width={240} height={32} />
            <Text className="mt-xxs text-label-sm tracking-[3px] text-muted">
              {barcodeDigits(passCode)}
            </Text>
          </View>
          <View className="mt-sm flex-row items-center gap-xs rounded-full bg-ice px-sm py-xxs">
            <Icon name="clock" size={16} color={Palette.accent} />
            <Text className="text-label-sm text-muted">인증 유효시간</Text>
            <Text className="text-label-md font-bold text-accent">{formatTimer(timer)}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="바코드 갱신"
              hitSlop={8}
              onPress={() => setTimer(PASS_TTL)}
              className="active:opacity-60">
              <Icon name="refresh" size={18} color={Palette.brand} />
            </Pressable>
          </View>
        </View>

        <View className="mt-sm gap-xs">
          <View className="flex-row items-center justify-center gap-xxs">
            <Icon name="scan" size={16} color={Palette.brand} />
            <Text className="text-label-sm text-muted">
              키오스크 및 현장 리더기 태그 시 5~10cm 거리를 유지해 주세요
            </Text>
          </View>
          <Button
            label={
              checkedIn
                ? '출석 체크가 완료되었습니다!'
                : activePass
                  ? '원터치 출석 체크 완료'
                  : '예약 후 출석 체크 가능 · 공간 예약하기'
            }
            variant={checkedIn ? 'accent' : 'primary'}
            leading={<Icon name={checkedIn ? 'check' : 'verified'} size={18} color="#FFFFFF" />}
            className={checkedIn ? 'bg-success' : ''}
            onPress={handleCheckIn}
          />
        </View>
      </View>

      {/* 오늘 이용 예약 */}
      <Card className="mt-md">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-xxs">
            <Badge label="이용 예약" tone="accent" />
            <Text className="text-title-lg font-semibold text-brand-deep">
              {selectedCenter?.name ?? '가족센터'}
            </Text>
          </View>
          <Text className="text-label-sm font-semibold text-success">
            {spacePass ? '입장 대기' : '예약 없음'}
          </Text>
        </View>
        {spacePass ? (
          <>
            <View className="mt-xs flex-row gap-sm rounded bg-ice p-sm">
              <View className="h-[48px] w-[48px] items-center justify-center rounded bg-brand-soft">
                <Icon name="people" size={24} color={Palette.brand} />
              </View>
              <View className="flex-1">
                <Text numberOfLines={1} className="text-label-md font-semibold text-brand-deep">
                  {spacePass.title}
                </Text>
                <Text className="mt-xxs text-body-sm text-muted">{spacePass.subtitle}</Text>
                <View className="mt-xxs flex-row items-center gap-xxs">
                  <Icon name="user" size={14} color={Palette.brand} />
                  <Text className="text-label-sm text-muted">
                    동반아동: {user.name.charAt(0)}하은 (24개월)
                  </Text>
                </View>
              </View>
            </View>
            <View className="mt-sm flex-row gap-xs">
              <Button
                label="예약 변경"
                variant="ghost"
                className="flex-1"
                leading={<Icon name="calendar" size={16} color={Palette.brand} />}
                onPress={() => router.push('/reserve')}
              />
              <Button
                label="센터 길찾기"
                variant="ghost"
                className="flex-1"
                leading={<Icon name="pin" size={16} color={Palette.brand} />}
                onPress={openDirections}
              />
            </View>
          </>
        ) : (
          <View className="mt-xs">
            <EmptyState
              icon="calendar"
              title="예약된 공간이 없습니다"
              action={<Button label="공동육아나눔터 예약" onPress={() => router.push('/reserve')} />}
            />
          </View>
        )}
      </Card>

      {/* 장난감 도서관 대여 현황 */}
      <View className="mt-lg">
        <View className="mb-xs flex-row items-center justify-between">
          <View className="flex-row items-center gap-xxs">
            <Icon name="toy" size={20} color={Palette.accent} />
            <Text className="text-title-lg font-semibold text-brand-deep">장난감 도서관 대여 현황</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/toys')}
            className="flex-row items-center active:opacity-60">
            <Text className="text-label-sm text-muted">전체 교구 보기</Text>
            <Icon name="chevron-right" size={14} color={Palette.muted} />
          </Pressable>
        </View>

        <Card>
          <View className="flex-row items-center justify-between">
            <Text className="text-label-sm text-muted">현재 대여 중인 교구</Text>
            {toyPass ? (
              <Badge
                label={`반납 D-${Math.max(0, daysUntil(toyPass.validUntil.slice(0, 10)))}`}
                tone="accent"
              />
            ) : null}
          </View>
          {toyPass ? (
            <>
              <View className="mt-xs flex-row items-center gap-sm">
                <View className="h-[64px] w-[64px] items-center justify-center rounded bg-accent-soft">
                  <Icon name="toy" size={30} color={Palette.accent} />
                </View>
                <View className="flex-1">
                  <Text numberOfLines={1} className="text-label-md font-semibold text-brand-deep">
                    {toyPass.title}
                  </Text>
                  <Text className="mt-xxs text-body-sm text-muted">
                    반납 예정일: {formatDate(toyPass.validUntil.slice(0, 10))}
                  </Text>
                  <Text className="mt-xxs text-label-sm text-brand">관리번호: {toyPass.code}</Text>
                </View>
              </View>
              <View className="mt-sm flex-row items-center justify-between">
                <View className="flex-row items-center gap-xxs">
                  <Icon name="refresh" size={14} color={Palette.success} />
                  <Text className="text-label-sm text-muted">
                    연장 가능 횟수: {extended ? '0회' : '1회'} 남음
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  disabled={extended}
                  onPress={() => setExtended(true)}
                  className={`rounded px-sm py-xxs active:opacity-70 ${extended ? 'bg-ice' : 'bg-brand-soft'}`}>
                  <Text className={`text-label-md font-semibold ${extended ? 'text-muted' : 'text-brand'}`}>
                    {extended ? '연장 신청 완료 (+7일)' : '대여 연장 신청'}
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <Text className="mt-xs text-body-sm text-muted">
              대여 중인 교구가 없습니다. 아래 보유 현황에서 바로 예약할 수 있습니다.
            </Text>
          )}
        </Card>

        <Card className="mt-xs">
          <View className="mb-sm flex-row items-center justify-between">
            <Text className="text-label-md font-semibold text-brand-deep">센터 실시간 보유 현황</Text>
            <Text className="text-label-sm text-muted">{selectedCenter?.name ?? ''} 기준</Text>
          </View>
          <View className="gap-xs">
            {toys.length ? (
              toys.map((toy) => {
                const rentable = toy.available > 0 && toy.condition === 'available';
                const notify = notifyToyIds.includes(toy.id);
                return (
                  <View key={toy.id} className="flex-row items-center justify-between rounded bg-ice p-xs">
                    <View className="flex-1 flex-row items-center gap-xs">
                      <View className="h-[40px] w-[40px] items-center justify-center rounded bg-canvas">
                        <Icon name="toy" size={20} color={rentable ? Palette.accent : Palette.subtle} />
                      </View>
                      <View className="flex-1">
                        <Text numberOfLines={1} className="text-label-md font-semibold text-brand-deep">
                          {toy.name}
                        </Text>
                        <Text
                          className={`text-body-sm ${rentable ? 'font-semibold text-success' : 'text-muted'}`}>
                          {rentable ? `대여가능 ${toy.available}개` : `대여중 (${toy.rentalDays}일 후 반납예정)`}
                        </Text>
                      </View>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() =>
                        rentable
                          ? setPendingToy(toy)
                          : setNotifyToyIds((ids) =>
                              ids.includes(toy.id) ? ids.filter((id) => id !== toy.id) : [...ids, toy.id]
                            )
                      }
                      className={`rounded px-xs py-xxs active:opacity-70 ${
                        rentable ? 'bg-success-soft' : notify ? 'bg-brand' : 'bg-[#E0E9F8]'
                      }`}>
                      <Text
                        className={`text-label-sm font-semibold ${
                          rentable ? 'text-success' : notify ? 'text-white' : 'text-brand'
                        }`}>
                        {rentable ? '바로 예약' : notify ? '알림 예약됨' : '알림 예약'}
                      </Text>
                    </Pressable>
                  </View>
                );
              })
            ) : (
              <Text className="text-body-sm text-muted">이 센터는 장난감 도서관을 운영하지 않습니다.</Text>
            )}
          </View>
        </Card>
      </View>

      {/* 우리동네 육아 품앗이 */}
      <View className="mt-lg">
        <View className="mb-xs flex-row items-center justify-between">
          <View>
            <Text className="text-title-lg font-semibold text-brand-deep">우리동네 육아 품앗이</Text>
            <Text className="text-body-sm text-muted">이웃 가족들과 함께 돌보고 소통해요</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => setCreateGroup(true)}
            className="flex-row items-center gap-xxs rounded bg-brand-soft px-xs py-xxs active:opacity-70">
            <Icon name="plus" size={14} color={Palette.brand} />
            <Text className="text-label-sm font-semibold text-brand">모임 만들기</Text>
          </Pressable>
        </View>
        <View className="gap-xs">
          {groups.length ? (
            groups.map((group) => {
              const joined = joinedGroupIds.includes(group.id);
              const full = !joined && group.members >= group.capacity;
              return (
                <Card key={group.id}>
                  <View className="flex-row flex-wrap items-center gap-xxs">
                    <Badge label={group.area} tone="brand" />
                    <Text className="text-label-md font-semibold text-brand-deep">{group.title}</Text>
                  </View>
                  <Text className="mt-xxs text-body-sm text-muted">{group.schedule}</Text>
                  <View className="mt-sm flex-row items-center justify-between">
                    <View className="flex-row items-center gap-xs">
                      <View className="flex-row">
                        {group.initials.map((initial, i) => (
                          <View
                            key={initial}
                            className="h-[24px] w-[24px] items-center justify-center rounded-full border-2 border-canvas bg-[#E0E9F8]"
                            style={{ marginLeft: i === 0 ? 0 : -8 }}>
                            <Text className="text-label-sm text-brand">{initial}</Text>
                          </View>
                        ))}
                      </View>
                      <Text className="text-label-sm text-muted">
                        참여 {group.members + (joined ? 1 : 0)} / 정원 {group.capacity}가구
                      </Text>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      disabled={full}
                      onPress={() => toggleGroup(group.id)}
                      className={`rounded px-sm py-xxs active:opacity-70 ${
                        joined ? 'bg-success-soft' : full ? 'bg-ice' : 'bg-brand'
                      }`}>
                      <Text
                        className={`text-label-sm font-semibold ${
                          joined ? 'text-success' : full ? 'text-subtle' : 'text-white'
                        }`}>
                        {joined ? '참여 중 · 취소' : full ? '정원 마감' : '참여 신청'}
                      </Text>
                    </Pressable>
                  </View>
                </Card>
              );
            })
          ) : (
            <EmptyState icon="people" title="이 지역에는 아직 품앗이 모임이 없습니다" />
          )}
        </View>
      </View>

      {/* 안내데스크 */}
      {selectedCenter ? (
        <View className="mt-lg flex-row items-center justify-between rounded-md bg-ice p-md">
          <View className="flex-1 flex-row items-center gap-sm">
            <View className="h-[40px] w-[40px] items-center justify-center rounded-full bg-brand-soft">
              <Icon name="phone" size={18} color={Palette.brand} />
            </View>
            <View className="flex-1">
              <Text className="text-label-md font-semibold text-brand-deep">
                {selectedCenter.name} 안내데스크
              </Text>
              <Text className="text-body-sm text-muted">{selectedCenter.openHours}</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => Linking.openURL(`tel:${selectedCenter.tel}`)}
            className="rounded bg-accent px-sm py-xs active:opacity-80">
            <Text className="text-label-md font-semibold text-white">{selectedCenter.tel}</Text>
          </Pressable>
        </View>
      ) : null}

      <ConfirmSheet
        visible={pendingToy !== null}
        title="장난감을 바로 예약할까요?"
        description="대여 QR이 발급됩니다. 발급 후 3일 이내 방문하지 않으면 예약이 자동 취소됩니다."
        confirmLabel="예약하고 QR 받기"
        onCancel={() => setPendingToy(null)}
        onConfirm={() => {
          if (!pendingToy) return;
          const pass = rentToy(pendingToy.id);
          setPendingToy(null);
          if (pass) router.push(`/qr/${pass.id}`);
        }}>
        <Card className="bg-ice">
          <Text className="text-body-md font-semibold text-ink">{pendingToy?.name}</Text>
          <Text className="mt-xxs text-label-sm text-muted">
            대여 기간 {pendingToy?.rentalDays}일 · {selectedCenter?.name}
          </Text>
        </Card>
      </ConfirmSheet>

      <ConfirmSheet
        visible={createGroup}
        title="품앗이 모임 개설 신청"
        description="센터 담당자가 모임 취지와 안전 기준을 확인한 뒤 개설을 승인합니다. 신청서는 센터 방문 또는 전화로 접수됩니다."
        confirmLabel="센터에 전화하기"
        onCancel={() => setCreateGroup(false)}
        onConfirm={() => {
          setCreateGroup(false);
          if (selectedCenter) Linking.openURL(`tel:${selectedCenter.tel}`);
        }}
      />
    </Screen>
  );
}
