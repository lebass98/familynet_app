import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DetailHeader } from '@/components/ui/screen';
import { MaxContentWidth } from '@/constants/design';
import { ToyRental } from '@/features/pass/toy-rental';

export default function ToysScreen() {
  const router = useRouter();
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-ice">
      <DetailHeader title="장난감 도서관" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="w-full self-center px-md pt-md" style={{ maxWidth: MaxContentWidth }}>
          <ToyRental />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
