import { Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { Palette } from '@/constants/design';

export function EmptyState({
  icon = 'search',
  title,
  description,
  action,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <View className="items-center gap-xs rounded-md border border-dashed border-line bg-canvas px-md py-xl">
      <Icon name={icon} size={28} color={Palette.subtle} />
      <Text className="text-body-lg font-semibold text-ink">{title}</Text>
      {description ? (
        <Text className="text-center text-body-sm text-muted">{description}</Text>
      ) : null}
      {action ? <View className="mt-xs">{action}</View> : null}
    </View>
  );
}
