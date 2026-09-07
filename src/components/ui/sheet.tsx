import { Modal, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { GlassBackdrop } from '@/components/ui/glass';
import { MaxContentWidth } from '@/constants/design';

/**
 * 하단 글래스 시트형 확인 모달.
 * RN Alert 은 웹에서 동작하지 않으므로 앱/웹 공통으로 이 컴포넌트를 사용합니다.
 */
export function ConfirmSheet({
  visible,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  tone = 'primary',
  onConfirm,
  onCancel,
  children,
}: {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'accent';
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="닫기"
        onPress={onCancel}
        className="flex-1 justify-end bg-brand-deep/35 px-xs pb-xs">
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="w-full self-center overflow-hidden rounded-xl p-lg"
          style={{ maxWidth: MaxContentWidth }}>
          <GlassBackdrop tone="strong" radius={28} />
          <View className="mb-md h-[5px] w-[44px] self-center rounded-full bg-brand-deep/20" />
          <Text className="text-headline-md font-bold text-ink">{title}</Text>
          {description ? (
            <Text className="mt-xs text-body-md text-muted">{description}</Text>
          ) : null}
          {children ? <View className="mt-md">{children}</View> : null}
          <View className="mt-lg flex-row gap-xs">
            <Button label={cancelLabel} variant="outline" className="flex-1" onPress={onCancel} />
            <Button label={confirmLabel} variant={tone} className="flex-1" onPress={onConfirm} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
