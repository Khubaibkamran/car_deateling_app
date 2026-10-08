import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

type Props = { value: boolean; onValueChange: (value: boolean) => void; accessibilityLabel?: string };

const W = 24;
const H = 13.5;
const KNOB = 9;
const PAD = 2.25;
const OFF = '#2A333B';
const ON = '#FF8D28';

// Small orange pill toggle matching the "Available for Jobs" switch in the design.
export default function ToggleSwitch({ value, onValueChange, accessibilityLabel }: Props) {
  const v = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(v, { toValue: value ? 1 : 0, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [value, v]);

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      hitSlop={14}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={[styles.track, { backgroundColor: v.interpolate({ inputRange: [0, 1], outputRange: [OFF, ON] }) }]}>
        <Animated.View
          style={[
            styles.knob,
            {
              backgroundColor: v.interpolate({ inputRange: [0, 1], outputRange: [colors.textSecondary, colors.background] }),
              transform: [{ translateX: v.interpolate({ inputRange: [0, 1], outputRange: [0, W - KNOB - PAD * 2] }) }],
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: W, height: H, borderRadius: H / 2, padding: PAD, justifyContent: 'center' },
  knob: { width: KNOB, height: KNOB, borderRadius: KNOB / 2 },
});
