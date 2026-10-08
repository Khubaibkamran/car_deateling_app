import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { Animated, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/theme';

export const BANNER_W = 320;
export const BANNER_H = 149;

type Props = {
  image: ImageSourcePropType;
  /** Image is anchored to the bottom edge instead of centred (banner 2 in the design). */
  anchorBottom?: boolean;
  /** Source aspect ratio (w / h), needed when anchoring to the bottom. */
  aspect?: number;
  /** Darkness of the left-hand scrim and where it fades out (fractions of the width). */
  scrim: { opacity: number; solidUntil: number; clearAt: number };
  onRequestQuote?: () => void;
};

export default function PromoBanner({ image, anchorBottom, aspect = 1.5, scrim, onRequestQuote }: Props) {
  const press = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(press, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 5 }).start();

  const fill = anchorBottom
    ? { position: 'absolute' as const, bottom: 0, left: 0, width: BANNER_W, height: BANNER_W / aspect }
    : StyleSheet.absoluteFill;

  return (
    <Pressable onPressIn={() => to(0.98)} onPressOut={() => to(1)}>
      <Animated.View style={[styles.card, { transform: [{ scale: press }] }]}>
        <Animated.Image source={image} style={fill} resizeMode="cover" />
        <LinearGradient
          pointerEvents="none"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[`rgba(0,0,0,${scrim.opacity})`, `rgba(0,0,0,${scrim.opacity})`, 'rgba(0,0,0,0)']}
          locations={[0, scrim.solidUntil, scrim.clearAt]}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.badge}>
          <Text style={styles.badgeBig}>
            30% <Text style={styles.badgeSmall}>off</Text>
          </Text>
        </View>

        <View style={styles.copy}>
          <Text style={styles.title}>VIP Car Care</Text>
          <Text style={styles.subtitle}>Premium detailing for the car that deserves the best</Text>
        </View>

        <Pressable style={styles.quote} onPress={onRequestQuote}>
          <Text style={styles.quoteText}>Request Quote</Text>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: BANNER_W, height: BANNER_H, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.background },
  badge: {
    position: 'absolute',
    left: 243,
    top: 16,
    width: 93,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  badgeBig: { fontFamily: 'Syne_700Bold', fontSize: 12, color: colors.white },
  badgeSmall: { fontFamily: 'Poppins_400Regular', fontSize: 10 },
  copy: { position: 'absolute', left: 20, top: 20, width: 170, gap: 4 },
  title: { fontFamily: 'Syne_700Bold', fontSize: 20, letterSpacing: 0.4, color: colors.white },
  subtitle: { fontFamily: 'Poppins_500Medium', fontSize: 12, letterSpacing: 0.24, color: colors.textSecondary },
  quote: {
    position: 'absolute',
    left: 20,
    top: 98,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteText: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.white },
});
