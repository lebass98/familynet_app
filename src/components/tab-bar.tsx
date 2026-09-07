import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { GlassBackdrop } from '@/components/ui/glass';
import { MaxContentWidth, Palette, ShadowCard, TabBarHeight, TabBarOffset } from '@/constants/design';

const TAB_META: Record<string, { label: string; icon: IconName }> = {
  index: { label: '홈', icon: 'home' },
  pass: { label: '스마트패스', icon: 'qr' },
  counseling: { label: '가족상담', icon: 'chat' },
  my: { label: '다문화·마이', icon: 'globe' },
};

/** 플로팅 글래스 탭바 — 콘텐츠 위에 떠 있고 스크롤 내용이 비쳐 보입니다 */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      className="absolute bottom-0 left-0 right-0 items-center px-md"
      style={{ paddingBottom: Math.max(insets.bottom, TabBarOffset) }}>
      <View
        className="w-full flex-row overflow-hidden rounded-full"
        style={[ShadowCard, { height: TabBarHeight, maxWidth: MaxContentWidth }]}>
        <GlassBackdrop tone="strong" radius={999} />
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
              className="flex-1 items-center justify-center gap-[2px] active:opacity-60"
              style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}>
              <View
                className={`h-[34px] w-[56px] items-center justify-center rounded-full ${
                  focused ? 'bg-brand/12' : ''
                }`}>
                <Icon name={meta.icon} size={24} color={color} filled={focused} />
              </View>
              <Text
                numberOfLines={1}
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
