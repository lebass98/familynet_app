import { Text, View } from 'react-native';

/** 정원 충족률 게이지 */
export function CapacityBar({
  applied,
  capacity,
  showLabel = true,
}: {
  applied: number;
  capacity: number;
  showLabel?: boolean;
}) {
  const ratio = capacity === 0 ? 0 : Math.min(1, applied / capacity);
  const remaining = Math.max(0, capacity - applied);
  const tone = ratio >= 1 ? 'bg-subtle' : ratio >= 0.8 ? 'bg-accent' : 'bg-brand';

  return (
    <View className="gap-xxs">
      <View className="h-[6px] w-full overflow-hidden rounded-full bg-line">
        <View className={`h-full rounded-full ${tone}`} style={{ width: `${ratio * 100}%` }} />
      </View>
      {showLabel ? (
        <View className="flex-row justify-between">
          <Text className="text-label-sm text-muted">
            정원 {capacity}명 중 {applied}명 신청
          </Text>
          <Text
            className={`text-label-sm font-semibold ${
              remaining === 0 ? 'text-subtle' : remaining <= 3 ? 'text-accent' : 'text-brand'
            }`}>
            {remaining === 0 ? '정원 마감' : `잔여 ${remaining}자리`}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
