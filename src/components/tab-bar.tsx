import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { MaxContentWidth, Palette, ShadowRaised, TabBarHeight } from '@/constants/design';

const TAB_META: Record<string, { label: string; icon: IconName }> = {
  index: { label: '홈', icon: 'home' },
  pass: { label: '스마트패스', icon: 'qr' },
  counseling: { label: '가족상담', icon: 'chat' },
  my: { label: '다문화·마이', icon: 'globe' },
};

/** 하단 탭 바 — 웹/네이티브 동일 렌더링, 알림 미읽음 배지 포함 */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="w-full border-t border-line bg-canvas"
      style={[ShadowRaised, { paddingBottom: insets.bottom }]}>
      <View
        className="w-full flex-row self-center"
        style={{ height: TabBarHeight, maxWidth: MaxContentWidth }}>
        {state.routes.map((route, index) => {
          const meta = TAB_META[route.name];
          if (!meta) return null;
          const focused = state.index === index;
          const color = focused ? Palette.brand : Palette.subtle;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={meta.label}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              className="flex-1 items-center justify-center gap-xxs active:opacity-60"
              style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}>
              <View>
                <Icon name={meta.icon} size={24} color={color} filled={focused} />
              </View>
              <Text
                className={`text-label-sm ${focused ? 'font-bold text-brand' : 'font-medium text-subtle'}`}>
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
