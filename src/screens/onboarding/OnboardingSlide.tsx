import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, ImageSourcePropType, StyleSheet, useWindowDimensions, View } from 'react-native';
import Logo from '../../components/Logo';
import NextButton from '../../components/NextButton';
import Wordmark from '../../components/Wordmark';
import { colors } from '../../constants/theme';

const native = { useNativeDriver: true } as const;

type Props = {
  image: ImageSourcePropType;
  title: string;
  description: string;
  nextLabel?: string;
  onNext?: () => void;
  onBack?: () => void;
  /** Where the bottom gradient reaches full strength (fraction of height) and its opacity. */
  gradientEnd?: number;
  gradientOpacity?: number;
  /** Slight letter spacing used by later slides in the design. */
  tracking?: boolean;
};

// Reveal helper: fade + rise, started after `delay` ms.
function reveal(value: Animated.Value, delay: number) {
  return Animated.timing(value, { toValue: 1, duration: 650, delay, easing: Easing.out(Easing.cubic), ...native });
}

export default function OnboardingSlide({
  image,
  title,
  description,
  nextLabel = 'Next',
  onNext,
  onBack,
  gradientEnd = 0.61159,
  gradientOpacity = 0.9,
  tracking = false,
}: Props) {
  const { width, height } = useWindowDimensions();

  const zoom = useRef(new Animated.Value(0)).current;
  const header = useRef(new Animated.Value(0)).current;
  const titleIn = useRef(new Animated.Value(0)).current;
  const descIn = useRef(new Animated.Value(0)).current;
  const navIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(zoom, { toValue: 1, duration: 9000, easing: Easing.out(Easing.quad), ...native }).start();
    Animated.parallel([reveal(header, 100), reveal(titleIn, 350), reveal(descIn, 600), reveal(navIn, 850)]).start();
  }, [zoom, header, titleIn, descIn, navIn]);

  const rise = (v: Animated.Value, distance: number) => ({
    opacity: v,
    transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={image}
        resizeMode="cover"
        style={[
          StyleSheet.absoluteFill,
          { width, height, transform: [{ scale: zoom.interpolate({ inputRange: [0, 1], outputRange: [1.12, 1] }) }] },
        ]}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(16,20,24,0)', `rgba(16,20,24,${gradientOpacity})`, `rgba(16,20,24,${gradientOpacity})`]}
        locations={[0.27414, gradientEnd, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.header, { left: width * 0.2 + 59.65 }, rise(header, -16)]}>
        <Logo width={35.155} />
        <Wordmark width={width * (1 - 0.4553 - 0.3377)} />
      </Animated.View>

      <View style={styles.textBlock}>
        <Animated.Text style={[styles.title, tracking && { letterSpacing: 0.4 }, rise(titleIn, 28)]}>
          {title}
        </Animated.Text>
        <Animated.Text style={[styles.description, tracking && { letterSpacing: 0.16 }, rise(descIn, 22)]}>
          {description}
        </Animated.Text>
      </View>

      <Animated.View style={[styles.nav, onBack ? styles.navSpread : styles.navEnd, rise(navIn, 16)]}>
        {onBack && <NextButton label="Back" direction="back" onPress={onBack} />}
        <NextButton label={nextLabel} onPress={onNext} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  header: { position: 'absolute', top: 50, flexDirection: 'row', alignItems: 'center', gap: 10 },
  textBlock: { position: 'absolute', left: 24, right: 24, bottom: 104, gap: 10 },
  title: {
    fontFamily: 'RedHatDisplay_800ExtraBold',
    fontSize: 40,
    lineHeight: 50,
    color: colors.text,
  },
  description: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: colors.textSecondary,
  },
  nav: { position: 'absolute', left: 24, right: 24, bottom: 56, flexDirection: 'row' },
  navEnd: { justifyContent: 'flex-end' },
  navSpread: { justifyContent: 'space-between' },
});
