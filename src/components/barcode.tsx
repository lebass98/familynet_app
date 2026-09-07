import { useMemo } from 'react';
import { View } from 'react-native';

/** 코드 문자열로 결정적 줄무늬 바코드를 그립니다 (시연용). */
export function Barcode({
  code,
  height = 32,
  width = 220,
  color = '#10315C',
}: {
  code: string;
  height?: number;
  width?: number;
  color?: string;
}) {
  const bars = useMemo(() => {
    let seed = 7;
    for (let i = 0; i < code.length; i += 1) seed = (seed * 33 + code.charCodeAt(i)) >>> 0;
    const list: { w: number; gap: number }[] = [];
    for (let i = 0; i < 28; i += 1) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      list.push({ w: 1 + (seed % 3), gap: 1 + ((seed >> 8) % 3) });
    }
    return list;
  }, [code]);

  const total = bars.reduce((sum, b) => sum + b.w + b.gap, 0);
  const unit = width / total;

  return (
    <View
      accessible
      accessibilityLabel={`바코드 ${code}`}
      className="flex-row items-stretch"
      style={{ width, height }}>
      {bars.map((bar, i) => (
        <View key={i} className="flex-row">
          <View style={{ width: bar.w * unit, backgroundColor: color }} />
          <View style={{ width: bar.gap * unit }} />
        </View>
      ))}
    </View>
  );
}
