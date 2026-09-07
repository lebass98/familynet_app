/**
 * 시연용 QR 표현 컴포넌트.
 * 실제 QR 인코딩이 아니라 코드 문자열을 해시해 결정적으로 그린 패턴입니다.
 * TODO: 운영 시 react-native-qrcode-svg 등 실제 인코더로 교체 (코드 값 계약은 동일).
 */
import { useMemo } from 'react';
import { View } from 'react-native';

const SIZE = 21;

function buildMatrix(code: string): boolean[][] {
  // 문자열 → 32bit 해시 시드
  let seed = 0;
  for (let i = 0; i < code.length; i += 1) {
    seed = (seed * 31 + code.charCodeAt(i)) >>> 0;
  }
  const next = () => {
    // xorshift32
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    seed >>>= 0;
    return seed / 0xffffffff;
  };

  const matrix: boolean[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => next() > 0.52)
  );

  // 3개 코너의 파인더 패턴 배치
  const finder = (row: number, col: number) => {
    for (let r = 0; r < 7; r += 1) {
      for (let c = 0; c < 7; c += 1) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[row + r][col + c] = edge || core;
      }
    }
    // 파인더 주변 여백
    for (let i = -1; i <= 7; i += 1) {
      const rr = row + i;
      const cc = col + i;
      if (rr >= 0 && rr < SIZE) {
        if (col - 1 >= 0) matrix[rr][col - 1] = false;
        if (col + 7 < SIZE) matrix[rr][col + 7] = false;
      }
      if (cc >= 0 && cc < SIZE) {
        if (row - 1 >= 0) matrix[row - 1][cc] = false;
        if (row + 7 < SIZE) matrix[row + 7][cc] = false;
      }
    }
  };
  finder(0, 0);
  finder(0, SIZE - 7);
  finder(SIZE - 7, 0);

  return matrix;
}

export function QrCode({ code, size = 200 }: { code: string; size?: number }) {
  const matrix = useMemo(() => buildMatrix(code), [code]);
  const cell = size / SIZE;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`스마트패스 QR 코드 ${code}`}
      className="bg-canvas"
      style={{ width: size, height: size }}>
      {matrix.map((row, r) => (
        <View key={r} className="flex-row">
          {row.map((on, c) => (
            <View
              key={c}
              style={{
                width: cell,
                height: cell,
                backgroundColor: on ? '#10315C' : '#FFFFFF',
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
