import Tabs from 'expo-router/js-tabs';

import { TabBar } from '@/components/tab-bar';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: '홈' }} />
      <Tabs.Screen name="pass" options={{ title: '스마트패스' }} />
      <Tabs.Screen name="counseling" options={{ title: '가족상담' }} />
      <Tabs.Screen name="my" options={{ title: '다문화·마이' }} />
    </Tabs>
  );
}
