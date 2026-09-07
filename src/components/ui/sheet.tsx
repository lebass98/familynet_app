import { Modal, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { MaxContentWidth } from '@/constants/design';

/**
 * 하단 시트형 확인 모달.
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
        className="flex-1 justify-end bg-black/40">
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="w-full self-center rounded-t-xl bg-canvas p-lg"
          style={{ maxWidth: MaxContentWidth }}>
          <View className="mb-md h-[4px] w-[40px] self-center rounded-full bg-line" />
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
