import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../constants/theme';

type Props = {
  label?: string;
  direction?: 'next' | 'back';
  onPress?: () => void;
};

export default function NextButton({ label = 'Next', direction = 'next', onPress }: Props) {
  const back = direction === 'back';
  const nudge = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(nudge, { toValue: 1, duration: 650, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(nudge, { toValue: 0, duration: 650, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();
  }, [nudge]);

  const to = (v: number) =>
    Animated.spring(press, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  const arrows = (
    <Animated.View
      style={{
        transform: [
          { translateX: nudge.interpolate({ inputRange: [0, 1], outputRange: [0, back ? -5 : 5] }) },
          { scaleX: back ? -1 : 1 },
        ],
      }}
    >
      <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
        <Path d="M5.5946 8L0 1.86667L1.7027 0L9 8L1.7027 16L0 14.1333L5.5946 8Z" fill="white" />
        <Path d="M14.2162 8L8 1.86667L9.89189 0L18 8L9.89189 16L8 14.1333L14.2162 8Z" fill="white" />
      </Svg>
    </Animated.View>
  );

  return (
    <Pressable onPress={onPress} onPressIn={() => to(0.92)} onPressOut={() => to(1)} hitSlop={16}>
      <Animated.View style={[styles.row, { transform: [{ scale: press }] }]}>
        {back && arrows}
        <Text style={styles.label}>{label}</Text>
        {!back && arrows}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.white },
});
