import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import Logo from '../../components/Logo';
import PrimaryButton from '../../components/PrimaryButton';
import Wordmark from '../../components/Wordmark';
import { colors } from '../../constants/theme';

const TIRE = 751.284;
const TIRE_ROTATION = '-45.29deg';
const LOGO_W = 65.773;
const LOGO_H = 58;
const INTRO_SCALE = 90.722 / LOGO_W; // logo starts at the larger, centered size
const native = { useNativeDriver: true } as const;

type Props = { onGetStarted?: () => void };

export default function SplashScreen({ onGetStarted }: Props) {
  const { width, height } = useWindowDimensions();

  const bg = useRef(new Animated.Value(0)).current; // tire layers fade in
  const drift = useRef(new Animated.Value(0)).current; // slow tire drift loop
  const pop = useRef(new Animated.Value(0)).current; // logo pop-in
  const slide = useRef(new Animated.Value(0)).current; // logo moves into the lockup
  const word = useRef(new Animated.Value(0)).current; // wordmark reveal
  const cta = useRef(new Animated.Value(0)).current; // button rise

  useEffect(() => {
    Animated.timing(bg, { toValue: 1, duration: 1200, easing: Easing.out(Easing.quad), ...native }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 9000, easing: Easing.inOut(Easing.sin), ...native }),
        Animated.timing(drift, { toValue: 0, duration: 9000, easing: Easing.inOut(Easing.sin), ...native }),
      ]),
    ).start();

    Animated.sequence([
      Animated.spring(pop, { toValue: 1, speed: 6, bounciness: 10, ...native }),
      Animated.delay(450),
      Animated.parallel([
        Animated.timing(slide, { toValue: 1, duration: 750, easing: Easing.inOut(Easing.cubic), ...native }),
        Animated.sequence([
          Animated.delay(250),
          Animated.timing(word, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), ...native }),
        ]),
        Animated.sequence([
          Animated.delay(500),
          Animated.spring(cta, { toValue: 1, speed: 8, bounciness: 8, ...native }),
        ]),
      ]),
    ]).start();
  }, [bg, drift, pop, slide, word, cta]);

  // Final lockup positions, from the 430x932 Figma frame.
  const logoLeft = width * 0.2 + 24.09;
  const logoTop = height / 2 - 18;
  const startDx = width / 2 - (logoLeft + LOGO_W / 2);
  const startDy = height / 2 - (logoTop + LOGO_H / 2);

  const tires = [
    { cx: -124.77, cy: height / 2 - 240.77, dir: 1 },
    { cx: width * 0.3 + 35.23, cy: height / 2 + 288.23, dir: -1 },
  ];

  const logoScale = Animated.multiply(
    pop.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
    slide.interpolate({ inputRange: [0, 1], outputRange: [INTRO_SCALE, 1] }),
  );

  return (
    <View style={styles.container}>
      {tires.map((t, i) => (
        <Animated.Image
          key={i}
          source={require('../../../assets/images/splash/tire-bg.png')}
          resizeMode="cover"
          style={[
            styles.tire,
            {
              left: t.cx - TIRE / 2,
              top: t.cy - TIRE / 2,
              opacity: bg.interpolate({ inputRange: [0, 1], outputRange: [0, 0.1] }),
              transform: [
                { rotate: TIRE_ROTATION },
                { translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [0, 18 * t.dir] }) },
              ],
            },
          ]}
        />
      ))}

      <Animated.View
        style={{
          position: 'absolute',
          left: logoLeft,
          top: logoTop,
          opacity: pop.interpolate({ inputRange: [0, 0.4], outputRange: [0, 1], extrapolate: 'clamp' }),
          transform: [
            { translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [startDx, 0] }) },
            { translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [startDy, 0] }) },
            { scale: logoScale },
          ],
        }}
      >
        <Logo width={LOGO_W} />
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          left: width * 0.4442,
          top: logoTop + LOGO_H / 2 - 12.5,
          opacity: word,
          transform: [{ translateX: word.interpolate({ inputRange: [0, 1], outputRange: [-18, 0] }) }],
        }}
      >
        <Wordmark />
      </Animated.View>

      <Animated.View
        style={[
          styles.cta,
          {
            opacity: cta.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolate: 'clamp' }),
            transform: [{ translateY: cta.interpolate({ inputRange: [0, 1], outputRange: [70, 0] }) }],
          },
        ]}
      >
        <PrimaryButton title="Get Started" onPress={onGetStarted} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  tire: { position: 'absolute', width: TIRE, height: TIRE },
  cta: { position: 'absolute', left: 24, right: 24, bottom: 50 },
});
