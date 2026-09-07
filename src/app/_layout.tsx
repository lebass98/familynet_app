import '@/global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Palette } from '@/constants/design';
import { AppStoreProvider } from '@/store/app-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Pretendard GOV — 굵기별 정적 파일. 이름은 tailwind.config.js 의 GOV 맵과 일치해야 합니다.
  const [fontsLoaded, fontError] = useFonts({
    'PretendardGOV-Regular': require('@/assets/fonts/PretendardGOV-Regular.otf'),
    'PretendardGOV-Medium': require('@/assets/fonts/PretendardGOV-Medium.otf'),
    'PretendardGOV-SemiBold': require('@/assets/fonts/PretendardGOV-SemiBold.otf'),
    'PretendardGOV-Bold': require('@/assets/fonts/PretendardGOV-Bold.otf'),
  });
  // 웹은 정적 렌더링을 막지 않도록 폰트 로딩과 무관하게 바로 그립니다(font swap).
  const ready = Platform.OS === 'web' || fontsLoaded || !!fontError;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <AppStoreProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Palette.ice },
          }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="programs" />
          <Stack.Screen name="alerts" />
          <Stack.Screen name="reserve" />
          <Stack.Screen name="toys" />
          <Stack.Screen name="center-select" options={{ presentation: 'modal' }} />
          <Stack.Screen name="qr/[id]" options={{ presentation: 'modal' }} />
        </Stack>
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}
