/**
 * 의존성 없는 도형 기반 아이콘 세트.
 * react-native-svg 없이 View 조합으로 그려 iOS/Android/웹에서 동일하게 렌더링됩니다.
 */
import { Text, View, type ViewStyle } from 'react-native';

import { Palette } from '@/constants/design';

export type IconName =
  | 'home'
  | 'programs'
  | 'qr'
  | 'bell'
  | 'user'
  | 'pin'
  | 'search'
  | 'chevron-right'
  | 'chevron-left'
  | 'check'
  | 'close'
  | 'clock'
  | 'calendar'
  | 'toy'
  | 'star'
  | 'phone'
  | 'chat'
  | 'video'
  | 'globe'
  | 'heart'
  | 'shield'
  | 'plus'
  | 'arrow-right'
  | 'brightness'
  | 'refresh'
  | 'card'
  | 'folder'
  | 'megaphone'
  | 'people'
  | 'mood'
  | 'translate'
  | 'verified'
  | 'scan';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  /** 채움형(탭 선택 상태 등)으로 그릴지 여부 */
  filled?: boolean;
}

export function Icon({ name, size = 24, color = Palette.ink, filled = false }: IconProps) {
  const s = (n: number) => (n / 24) * size;
  const box: ViewStyle = { width: size, height: size, alignItems: 'center', justifyContent: 'center' };
  const stroke = Math.max(1.5, s(2));

  switch (name) {
    case 'home':
      return (
        <View style={box}>
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: s(11),
              borderRightWidth: s(11),
              borderBottomWidth: s(9),
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
            }}
          />
          <View
            style={{
              width: s(15),
              height: s(9),
              backgroundColor: filled ? color : 'transparent',
              borderColor: color,
              borderWidth: filled ? 0 : stroke,
              borderTopWidth: 0,
              borderBottomLeftRadius: s(3),
              borderBottomRightRadius: s(3),
            }}
          />
        </View>
      );

    case 'programs':
      return (
        <View style={[box, { justifyContent: 'center' }]}>
          {[16, 13, 10].map((w, i) => (
            <View
              key={w}
              style={{
                width: s(w),
                height: stroke,
                marginTop: i === 0 ? 0 : s(4),
                borderRadius: stroke,
                backgroundColor: color,
                alignSelf: 'flex-start',
                marginLeft: s(4),
              }}
            />
          ))}
        </View>
      );

    case 'qr': {
      const finder = (extra: ViewStyle) => (
        <View
          style={{
            position: 'absolute',
            width: s(8),
            height: s(8),
            borderWidth: stroke,
            borderColor: color,
            borderRadius: s(2),
            alignItems: 'center',
            justifyContent: 'center',
            ...extra,
          }}>
          {filled ? (
            <View style={{ width: s(2.5), height: s(2.5), backgroundColor: color }} />
          ) : null}
        </View>
      );
      return (
        <View style={box}>
          <View style={{ width: s(20), height: s(20) }}>
            {finder({ top: 0, left: 0 })}
            {finder({ top: 0, right: 0 })}
            {finder({ bottom: 0, left: 0 })}
            <View
              style={{
                position: 'absolute',
                bottom: s(1),
                right: s(1),
                width: s(6),
                height: s(6),
                backgroundColor: color,
                borderRadius: s(1),
              }}
            />
          </View>
        </View>
      );
    }

    case 'bell':
      return (
        <View style={box}>
          <View
            style={{
              width: s(14),
              height: s(13),
              borderWidth: filled ? 0 : stroke,
              backgroundColor: filled ? color : 'transparent',
              borderColor: color,
              borderTopLeftRadius: s(7),
              borderTopRightRadius: s(7),
              borderBottomLeftRadius: s(2),
              borderBottomRightRadius: s(2),
            }}
          />
          <View
            style={{
              width: s(18),
              height: stroke,
              backgroundColor: color,
              borderRadius: stroke,
              marginTop: s(1),
            }}
          />
          <View
            style={{
              width: s(5),
              height: s(2.5),
              backgroundColor: color,
              borderBottomLeftRadius: s(3),
              borderBottomRightRadius: s(3),
              marginTop: s(0.5),
            }}
          />
        </View>
      );

    case 'user':
      return (
        <View style={box}>
          <View
            style={{
              width: s(9),
              height: s(9),
              borderRadius: s(5),
              borderWidth: filled ? 0 : stroke,
              backgroundColor: filled ? color : 'transparent',
              borderColor: color,
            }}
          />
          <View
            style={{
              width: s(16),
              height: s(8),
              marginTop: s(1.5),
              borderWidth: filled ? 0 : stroke,
              backgroundColor: filled ? color : 'transparent',
              borderColor: color,
              borderBottomWidth: 0,
              borderTopLeftRadius: s(8),
              borderTopRightRadius: s(8),
            }}
          />
        </View>
      );

    case 'pin':
      return (
        <View style={box}>
          <View
            style={{
              width: s(15),
              height: s(15),
              borderRadius: s(8),
              borderWidth: stroke,
              borderColor: color,
              backgroundColor: filled ? color : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: s(5),
                height: s(5),
                borderRadius: s(3),
                backgroundColor: filled ? Palette.canvas : color,
              }}
            />
          </View>
          <View
            style={{
              width: 0,
              height: 0,
              marginTop: -s(2),
              borderLeftWidth: s(4),
              borderRightWidth: s(4),
              borderTopWidth: s(6),
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: color,
            }}
          />
        </View>
      );

    case 'search':
      return (
        <View style={box}>
          <View
            style={{
              width: s(14),
              height: s(14),
              borderRadius: s(8),
              borderWidth: stroke,
              borderColor: color,
              marginBottom: -s(2),
              marginRight: -s(2),
            }}
          />
          <View
            style={{
              width: s(6),
              height: stroke,
              backgroundColor: color,
              borderRadius: stroke,
              transform: [{ rotate: '45deg' }],
              alignSelf: 'flex-end',
              marginRight: s(2),
            }}
          />
        </View>
      );

    case 'chevron-right':
    case 'chevron-left':
      return (
        <View style={box}>
          <View
            style={{
              width: s(8),
              height: s(8),
              borderTopWidth: stroke,
              borderRightWidth: stroke,
              borderColor: color,
              transform: [{ rotate: name === 'chevron-right' ? '45deg' : '225deg' }],
              marginLeft: name === 'chevron-right' ? -s(2) : s(2),
            }}
          />
        </View>
      );

    case 'check':
      return (
        <View style={box}>
          <View
            style={{
              width: s(12),
              height: s(6),
              borderBottomWidth: stroke,
              borderLeftWidth: stroke,
              borderColor: color,
              transform: [{ rotate: '-45deg' }],
              marginTop: -s(3),
            }}
          />
        </View>
      );

    case 'close':
      return (
        <View style={box}>
          <View
            style={{
              position: 'absolute',
              width: s(16),
              height: stroke,
              backgroundColor: color,
              transform: [{ rotate: '45deg' }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: s(16),
              height: stroke,
              backgroundColor: color,
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </View>
      );

    case 'clock':
      return (
        <View style={box}>
          <View
            style={{
              width: s(18),
              height: s(18),
              borderRadius: s(10),
              borderWidth: stroke,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                position: 'absolute',
                width: stroke,
                height: s(5),
                backgroundColor: color,
                top: s(3.5),
              }}
            />
            <View
              style={{
                position: 'absolute',
                width: s(4),
                height: stroke,
                backgroundColor: color,
                left: s(7.5),
                top: s(7.5),
              }}
            />
          </View>
        </View>
      );

    case 'calendar':
      return (
        <View style={box}>
          <View
            style={{
              width: s(18),
              height: s(17),
              borderRadius: s(3),
              borderWidth: stroke,
              borderColor: color,
              overflow: 'hidden',
            }}>
            <View style={{ height: s(4), backgroundColor: color }} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: s(2), gap: s(1.5) }}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} style={{ width: s(3), height: s(3), backgroundColor: color, opacity: 0.7 }} />
              ))}
            </View>
          </View>
        </View>
      );

    case 'toy':
      return (
        <View style={box}>
          <View
            style={{
              width: s(18),
              height: s(11),
              borderTopLeftRadius: s(9),
              borderTopRightRadius: s(9),
              borderWidth: filled ? 0 : stroke,
              backgroundColor: filled ? color : 'transparent',
              borderColor: color,
              borderBottomWidth: 0,
            }}
          />
          <View style={{ width: s(18), height: stroke, backgroundColor: color }} />
          <View style={{ flexDirection: 'row', gap: s(6), marginTop: s(2) }}>
            <View style={{ width: s(4), height: s(4), borderRadius: s(2), backgroundColor: color }} />
            <View style={{ width: s(4), height: s(4), borderRadius: s(2), backgroundColor: color }} />
          </View>
        </View>
      );

    case 'star':
      return (
        <View style={box}>
          <Text style={{ fontSize: s(20), lineHeight: s(24), color, includeFontPadding: false }}>
            {filled ? '★' : '☆'}
          </Text>
        </View>
      );

    case 'phone':
      return (
        <View style={box}>
          <View
            style={{
              width: s(13),
              height: s(13),
              borderLeftWidth: s(4.5),
              borderBottomWidth: s(4.5),
              borderColor: color,
              borderBottomLeftRadius: s(7),
              borderTopLeftRadius: s(2.5),
              borderBottomRightRadius: s(2.5),
              transform: [{ rotate: '45deg' }],
              marginLeft: s(1),
              marginTop: -s(1),
            }}
          />
        </View>
      );

    case 'chat':
      return (
        <View style={box}>
          <View
            style={{
              width: s(18),
              height: s(14),
              borderRadius: s(5),
              borderWidth: filled ? 0 : stroke,
              borderColor: color,
              backgroundColor: filled ? color : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: s(2),
            }}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={{
                  width: s(2),
                  height: s(2),
                  borderRadius: s(1),
                  backgroundColor: filled ? Palette.canvas : color,
                }}
              />
            ))}
          </View>
          <View
            style={{
              width: 0,
              height: 0,
              marginTop: -s(1),
              marginLeft: -s(8),
              borderLeftWidth: s(3),
              borderRightWidth: s(3),
              borderTopWidth: s(4),
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: color,
            }}
          />
        </View>
      );

    case 'video':
      return (
        <View style={[box, { flexDirection: 'row', gap: s(1) }]}>
          <View
            style={{
              width: s(14),
              height: s(11),
              borderRadius: s(2),
              borderWidth: filled ? 0 : stroke,
              borderColor: color,
              backgroundColor: filled ? color : 'transparent',
            }}
          />
          <View
            style={{
              width: 0,
              height: 0,
              borderTopWidth: s(5),
              borderBottomWidth: s(5),
              borderRightWidth: s(5),
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              borderRightColor: color,
            }}
          />
        </View>
      );

    case 'globe':
      return (
        <View style={box}>
          <View
            style={{
              width: s(18),
              height: s(18),
              borderRadius: s(9),
              borderWidth: stroke,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
            <View
              style={{
                position: 'absolute',
                width: s(8),
                height: s(18),
                borderRadius: s(4),
                borderWidth: stroke,
                borderColor: color,
              }}
            />
            <View style={{ position: 'absolute', width: s(18), height: stroke, backgroundColor: color }} />
          </View>
        </View>
      );

    case 'heart':
      return (
        <View style={box}>
          <Text style={{ fontSize: s(19), lineHeight: s(24), color, includeFontPadding: false }}>
            {filled ? '♥' : '♡'}
          </Text>
        </View>
      );

    case 'shield':
      return (
        <View style={box}>
          <View
            style={{
              width: s(15),
              height: s(18),
              borderWidth: filled ? 0 : stroke,
              borderColor: color,
              backgroundColor: filled ? color : 'transparent',
              borderTopLeftRadius: s(3),
              borderTopRightRadius: s(3),
              borderBottomLeftRadius: s(8),
              borderBottomRightRadius: s(8),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: s(7),
                height: s(4),
                borderBottomWidth: stroke,
                borderLeftWidth: stroke,
                borderColor: filled ? Palette.canvas : color,
                transform: [{ rotate: '-45deg' }],
                marginTop: -s(2),
              }}
            />
          </View>
        </View>
      );

    case 'plus':
      return (
        <View style={box}>
          <View style={{ position: 'absolute', width: s(14), height: stroke, backgroundColor: color }} />
          <View style={{ position: 'absolute', width: stroke, height: s(14), backgroundColor: color }} />
        </View>
      );

    case 'arrow-right':
      return (
        <View style={box}>
          <View style={{ position: 'absolute', width: s(14), height: stroke, backgroundColor: color }} />
          <View
            style={{
              position: 'absolute',
              right: s(5),
              width: s(8),
              height: s(8),
              borderTopWidth: stroke,
              borderRightWidth: stroke,
              borderColor: color,
              transform: [{ rotate: '45deg' }],
            }}
          />
        </View>
      );

    case 'brightness':
      return (
        <View style={box}>
          <View
            style={{
              width: s(10),
              height: s(10),
              borderRadius: s(5),
              backgroundColor: color,
            }}
          />
          {[0, 45, 90, 135].map((deg) => (
            <View
              key={deg}
              style={{
                position: 'absolute',
                width: s(20),
                height: stroke,
                backgroundColor: color,
                transform: [{ rotate: `${deg}deg` }],
                opacity: 0.9,
              }}
            />
          ))}
          <View
            style={{
              position: 'absolute',
              width: s(14),
              height: s(14),
              borderRadius: s(7),
              backgroundColor: 'transparent',
              borderWidth: s(2),
              borderColor: Palette.canvas,
            }}
          />
        </View>
      );

    case 'refresh':
      return (
        <View style={box}>
          <View
            style={{
              width: s(16),
              height: s(16),
              borderRadius: s(8),
              borderWidth: stroke,
              borderColor: color,
              borderRightColor: 'transparent',
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: s(3),
              top: s(5),
              width: 0,
              height: 0,
              borderLeftWidth: s(3),
              borderRightWidth: s(3),
              borderTopWidth: s(5),
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: color,
            }}
          />
        </View>
      );

    case 'card':
      return (
        <View style={box}>
          <View
            style={{
              width: s(20),
              height: s(14),
              borderRadius: s(3),
              borderWidth: stroke,
              borderColor: color,
              padding: s(2),
              gap: s(2),
            }}>
            <View style={{ width: s(5), height: s(4), borderRadius: s(1), backgroundColor: color }} />
            <View style={{ width: s(12), height: stroke, backgroundColor: color, opacity: 0.7 }} />
          </View>
        </View>
      );

    case 'folder':
      return (
        <View style={box}>
          <View
            style={{
              width: s(8),
              height: s(3),
              borderTopLeftRadius: s(2),
              borderTopRightRadius: s(2),
              backgroundColor: color,
              alignSelf: 'flex-start',
              marginLeft: s(3),
            }}
          />
          <View
            style={{
              width: s(18),
              height: s(13),
              borderRadius: s(2),
              borderWidth: filled ? 0 : stroke,
              borderColor: color,
              backgroundColor: filled ? color : 'transparent',
            }}
          />
        </View>
      );

    case 'megaphone':
      return (
        <View style={[box, { flexDirection: 'row' }]}>
          <View
            style={{
              width: s(6),
              height: s(8),
              borderRadius: s(1),
              backgroundColor: color,
            }}
          />
          <View
            style={{
              width: 0,
              height: 0,
              borderTopWidth: s(8),
              borderBottomWidth: s(8),
              borderRightWidth: s(10),
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              borderRightColor: color,
            }}
          />
        </View>
      );

    case 'people':
      return (
        <View style={[box, { flexDirection: 'row', alignItems: 'flex-end', gap: s(1) }]}>
          {[0, 1].map((i) => (
            <View key={i} style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: s(7),
                  height: s(7),
                  borderRadius: s(4),
                  borderWidth: filled ? 0 : stroke,
                  borderColor: color,
                  backgroundColor: filled ? color : 'transparent',
                }}
              />
              <View
                style={{
                  width: s(11),
                  height: s(6),
                  marginTop: s(1),
                  borderWidth: filled ? 0 : stroke,
                  borderColor: color,
                  borderBottomWidth: 0,
                  borderTopLeftRadius: s(6),
                  borderTopRightRadius: s(6),
                  backgroundColor: filled ? color : 'transparent',
                }}
              />
            </View>
          ))}
        </View>
      );

    case 'mood':
      return (
        <View style={box}>
          <View
            style={{
              width: s(18),
              height: s(18),
              borderRadius: s(9),
              borderWidth: stroke,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={{ flexDirection: 'row', gap: s(4), marginTop: -s(3) }}>
              <View style={{ width: s(2), height: s(2), borderRadius: s(1), backgroundColor: color }} />
              <View style={{ width: s(2), height: s(2), borderRadius: s(1), backgroundColor: color }} />
            </View>
            <View
              style={{
                width: s(8),
                height: s(4),
                borderBottomWidth: stroke,
                borderColor: color,
                borderBottomLeftRadius: s(4),
                borderBottomRightRadius: s(4),
                marginTop: s(1),
              }}
            />
          </View>
        </View>
      );

    case 'translate':
      return (
        <View style={box}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: s(10.5),
              lineHeight: s(24),
              color,
              fontWeight: '700',
              letterSpacing: -0.5,
              includeFontPadding: false,
            }}>
            A文
          </Text>
        </View>
      );

    case 'verified':
      return (
        <View style={box}>
          <View
            style={{
              width: s(18),
              height: s(18),
              borderRadius: s(9),
              backgroundColor: filled ? color : 'transparent',
              borderWidth: filled ? 0 : stroke,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: s(8),
                height: s(4),
                borderBottomWidth: stroke,
                borderLeftWidth: stroke,
                borderColor: filled ? Palette.canvas : color,
                transform: [{ rotate: '-45deg' }],
                marginTop: -s(2),
              }}
            />
          </View>
        </View>
      );

    case 'scan': {
      const corner = (extra: ViewStyle) => (
        <View
          style={{
            position: 'absolute',
            width: s(7),
            height: s(7),
            borderColor: color,
            ...extra,
          }}
        />
      );
      return (
        <View style={box}>
          <View style={{ width: s(20), height: s(20) }}>
            {corner({ top: 0, left: 0, borderTopWidth: stroke, borderLeftWidth: stroke })}
            {corner({ top: 0, right: 0, borderTopWidth: stroke, borderRightWidth: stroke })}
            {corner({ bottom: 0, left: 0, borderBottomWidth: stroke, borderLeftWidth: stroke })}
            {corner({ bottom: 0, right: 0, borderBottomWidth: stroke, borderRightWidth: stroke })}
            <View
              style={{
                position: 'absolute',
                top: s(9),
                left: s(3),
                width: s(14),
                height: stroke,
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      );
    }
  }
}
