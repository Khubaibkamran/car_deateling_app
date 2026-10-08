import { ReactNode, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ArrowUpIcon } from '../../components/homeIcons';
import { colors } from '../../constants/theme';

const tire = require('../../../assets/images/splash/tire-bg.png');

/** The small square "go" button in each tile's corner. */
function GoButton({ style }: { style: ViewStyle }) {
  return (
    <View style={[styles.go, style]}>
      <View style={{ transform: [{ rotate: '45.2deg' }] }}>
        <ArrowUpIcon />
      </View>
    </View>
  );
}

type TileProps = { width?: number; height: number; onPress?: () => void; children: ReactNode; style?: ViewStyle };

function Tile({ width, height, onPress, children, style }: TileProps) {
  const press = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(press, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 5 }).start();
  return (
    <Pressable onPress={onPress} onPressIn={() => to(0.97)} onPressOut={() => to(1)} style={width ? { width } : { flex: 1 }}>
      <Animated.View style={[styles.tile, { height, transform: [{ scale: press }] }, style]}>
        <View style={[styles.tileBg, { height: height - 4 }]} />
        {children}
      </Animated.View>
    </Pressable>
  );
}

type Props = { onSelect?: (service: 'exterior' | 'auto' | 'interior') => void };

export default function ServicesCatalog({ onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Tile width={183} height={104} onPress={() => onSelect?.('exterior')}>
          <Image source={tire} style={[styles.tire, { width: 197, height: 197, left: -7, top: -45 }]} />
          <View style={styles.exteriorImageBox}>
            <Image
              source={require('../../../assets/images/home/service-exterior.png')}
              style={{ position: 'absolute', width: 132.8, height: 132.5, left: -6.8, top: -8.6 }}
            />
          </View>
          <Text style={[styles.title, { left: 12, top: 16, width: 108, lineHeight: 18 }]}>Exterior Detailing</Text>
          <GoButton style={{ left: 12, top: 65 }} />
        </Tile>

        <Tile width={183} height={104} onPress={() => onSelect?.('auto')}>
          <Image source={tire} style={[styles.tire, { width: 197, height: 197, left: -7, top: -45 }]} />
          <Image
            source={require('../../../assets/images/home/service-auto.png')}
            style={{ position: 'absolute', width: 204, height: 80, left: -69, top: 24 }}
            resizeMode="stretch"
          />
          <Text style={[styles.title, { left: 83, top: 16 }]}>Auto Service</Text>
          <GoButton style={{ right: 12, top: 65 }} />
        </Tile>
      </View>

      <Tile height={110} onPress={() => onSelect?.('interior')}>
        <Image source={tire} style={[styles.tire, { width: 228, height: 228, left: 0, top: -88 }]} />
        <View style={styles.interiorImageBox}>
          <Image
            source={require('../../../assets/images/home/service-interior.png')}
            style={{ position: 'absolute', width: 281, height: 158, left: -17.8, top: -29.6 }}
          />
        </View>
        <Text style={[styles.title, { left: 12, top: 12 }]}>{'Interior Detailing &\nPaint Protection'}</Text>
        <GoButton style={{ left: 12, top: 74 }} />
      </Tile>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 16 },
  row: { flexDirection: 'row', gap: 16 },
  tile: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  tileBg: { position: 'absolute', top: 4, left: 0, right: 0, borderRadius: 12, backgroundColor: colors.background },
  tire: { position: 'absolute', opacity: 0.2 },
  title: { position: 'absolute', fontFamily: 'Poppins_500Medium', fontSize: 14, lineHeight: 21, color: colors.white },
  go: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  exteriorImageBox: { position: 'absolute', left: 66, top: 1, width: 126, height: 113, overflow: 'hidden' },
  interiorImageBox: { position: 'absolute', left: 143, top: 13, width: 250, height: 100, overflow: 'hidden' },
});
