import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AmbientBackground } from '@/components/ui/glass';

import { DetailHeader } from '@/components/ui/screen';
import { MaxContentWidth } from '@/constants/design';
import { SpaceReservation } from '@/features/pass/space-reservation';

export default function ReserveScreen() {
  const router = useRouter();
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#EEF3FA]">
      <AmbientBackground />
      <DetailHeader title="공동육아나눔터 예약" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="w-full self-center px-md pt-md" style={{ maxWidth: MaxContentWidth }}>
          <SpaceReservation />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
