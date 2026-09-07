import * as Device from 'expo-device';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            Welcome to&nbsp;Expo
          </ThemedText>
        </ThemedView>

        {/* Tailwind CSS (NativeWind) 적용 확인 카드 */}
        <View className="w-full bg-indigo-600 rounded-2xl p-5 shadow-lg my-2 border border-indigo-400/30">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white text-base font-bold">✨ Tailwind CSS (NativeWind)</Text>
            <View className="bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/40">
              <Text className="text-emerald-300 text-xs font-semibold">Ready</Text>
            </View>
          </View>
          <Text className="text-indigo-100 text-xs mb-3">
            모바일(iOS, Android) 및 웹에서 Tailwind CSS 클래스가 적용됩니다.
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="bg-white/10 px-2.5 py-1 rounded-lg">
              <Text className="text-white text-xs font-medium">#NativeWind v4</Text>
            </View>
            <View className="bg-white/10 px-2.5 py-1 rounded-lg">
              <Text className="text-white text-xs font-medium">#Tailwind CSS</Text>
            </View>
            <View className="bg-white/10 px-2.5 py-1 rounded-lg">
              <Text className="text-white text-xs font-medium">#Expo SDK 57</Text>
            </View>
          </View>
        </View>

        <ThemedText type="code" style={styles.code}>
          get started
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <HintRow
            title="Try editing"
            hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
          />
          <HintRow title="Dev tools" hint={getDevMenuHint()} />
          <HintRow
            title="Fresh start"
            hint={<ThemedText type="code">npm run reset-project</ThemedText>}
          />
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
