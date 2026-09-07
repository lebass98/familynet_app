import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { QrCode } from '@/components/qr-code';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MaxContentWidth } from '@/constants/design';
import { getCenterSync } from '@/services/familynet';
import { useAppStore } from '@/store/app-store';
import { formatRelative } from '@/utils/format';

export default function QrPassScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { passes, checkInPass } = useAppStore();

  const pass = passes.find((p) => p.id === id);
  const center = pass ? getCenterSync(pass.centerId) : undefined;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-brand-deep">
      <View className="h-[56px] flex-row items-center justify-between px-md">
        <Text className="text-title-lg font-semibold text-white">모바일 스마트패스</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="닫기"
          onPress={() => router.back()}
          className="h-[40px] w-[40px] items-center justify-center active:opacity-60">
          <Icon name="close" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      {!pass ? (
        <View className="flex-1 items-center justify-center px-md">
          <Text className="text-body-lg text-white">패스 정보를 찾을 수 없습니다.</Text>
        </View>
      ) : (
        <View className="w-full flex-1 self-center px-md" style={{ maxWidth: MaxContentWidth }}>
          <Card className="mt-md items-center">
            <Badge
              label={pass.status === 'active' ? '사용 가능' : pass.status === 'used' ? '사용 완료' : '기간 만료'}
              tone={pass.status === 'active' ? 'success' : 'neutral'}
            />
            <Text className="mt-xs text-center text-headline-md font-bold text-ink">
              {pass.title}
            </Text>
            <Text className="mt-xxs text-center text-body-sm text-muted">{pass.subtitle}</Text>

            <View className="my-md items-center">
              <View className={pass.status === 'active' ? '' : 'opacity-25'}>
                <QrCode code={pass.code} size={210} />
              </View>
              {pass.status !== 'active' ? (
                <View className="absolute inset-0 items-center justify-center">
                  <Text className="text-headline-md font-bold text-subtle">사용 완료</Text>
                </View>
              ) : null}
            </View>

            <Text className="text-label-md font-semibold tracking-[2px] text-brand">
              {pass.code}
            </Text>
            <Text className="mt-xxs text-label-sm text-subtle">
              {center?.name} · 발급 {formatRelative(pass.issuedAt)}
            </Text>
          </Card>

          <View className="mt-md flex-row items-start gap-xs rounded-md bg-white/10 p-sm">
            <Icon name="qr" size={18} color="#FFFFFF" />
            <Text className="flex-1 text-body-sm text-white">
              현장 키오스크 스캐너에 화면을 비추면 출석 체크와 대여·반납이 자동 처리됩니다. 화면
              밝기를 최대로 올려 주세요.
            </Text>
          </View>

          <View className="mt-auto pb-lg">
            {pass.status === 'active' ? (
              <Button
                label="현장 체크인 처리 (시연)"
                variant="accent"
                size="lg"
                onPress={() => checkInPass(pass.id)}
              />
            ) : (
              <Button label="닫기" variant="outline" size="lg" onPress={() => router.back()} />
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
