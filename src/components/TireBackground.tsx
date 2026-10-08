import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';

const TIRE = 751.284;
const native = { useNativeDriver: true } as const;

// Two rotated tire-print layers (offsets from the 430x932 Figma frame): fade in, then drift slowly.
export default function TireBackground({ opacity = 0.1 }: { opacity?: number }) {
  const { width, height } = useWindowDimensions();
  const fade = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 1200, easing: Easing.out(Easing.quad), ...native }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 9000, easing: Easing.inOut(Easing.sin), ...native }),
        Animated.timing(drift, { toValue: 0, duration: 9000, easing: Easing.inOut(Easing.sin), ...native }),
      ]),
    ).start();
  }, [fade, drift]);

  const layers = [
    { cx: -124.77, cy: height / 2 - 240.77, dir: 1 },
    { cx: width * 0.3 + 32.23, cy: height / 2 + 290.23, dir: -1 },
  ];

  return (
    <>
      {layers.map((l, i) => (
        <Animated.Image
          key={i}
          source={require('../../assets/images/splash/tire-bg.png')}
          resizeMode="cover"
          style={[
            styles.tire,
            {
              left: l.cx - TIRE / 2,
              top: l.cy - TIRE / 2,
              opacity: fade.interpolate({ inputRange: [0, 1], outputRange: [0, opacity] }),
              transform: [
                { rotate: '-45.29deg' },
                { translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [0, 18 * l.dir] }) },
              ],
            },
          ]}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  tire: { position: 'absolute', width: TIRE, height: TIRE },
});
