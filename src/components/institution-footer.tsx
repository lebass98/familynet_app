import { Text, View } from 'react-native';

import { useAppStore } from '@/store/app-store';

/** 공공기관 하단 푸터 */
export function InstitutionFooter() {
  const { selectedCenter } = useAppStore();
  return (
    <View className="mt-lg gap-sm rounded-md bg-brand-soft/60 px-md py-lg">
      <View className="flex-row flex-wrap items-center gap-xs">
        <Text className="text-label-md font-bold text-brand">한국건강가정진흥원</Text>
        <View className="h-[12px] w-[1px] bg-line" />
        <Text className="text-label-md font-medium text-brand-deep">
          {selectedCenter?.name ?? '가족센터'}
        </Text>
        <View className="ml-auto rounded bg-white/75 px-xs py-[2px]">
          <Text className="text-label-sm font-semibold text-brand-deep">공공기관 웹접근성 인증</Text>
        </View>
      </View>
      <View className="flex-row flex-wrap gap-x-sm gap-y-xxs">
        <Text className="text-label-sm font-bold text-accent">개인정보처리방침</Text>
        <Text className="text-label-sm text-muted">이용약관</Text>
        <Text className="text-label-sm text-muted">원격지원 안내</Text>
        <Text className="text-label-sm text-muted">찾아오시는 길</Text>
      </View>
      <View className="gap-xxs">
        {selectedCenter ? (
          <>
            <Text className="text-body-sm text-subtle">{selectedCenter.address}</Text>
            <Text className="text-body-sm text-subtle">센터 대표전화: {selectedCenter.tel}</Text>
          </>
        ) : null}
        <Text className="mt-xs text-label-sm text-subtle">
          © Korean Institute for Healthy Family. All rights reserved.
        </Text>
      </View>
    </View>
  );
}
