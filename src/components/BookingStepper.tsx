import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import {
  StepBoxIcon,
  StepCalendarIcon,
  StepCalendarSolidIcon,
  StepCarIcon,
  StepLocationFilledIcon,
  StepLocationIcon,
  StepPaymentIcon,
} from './bookingIcons';
import { StepPaymentFilledIcon } from './flowIcons';

const STEPS = ['Vehicle', 'Service', 'Schedule', 'Location', 'Payment'] as const;
// Left edge of each 47px step and of each connector, from the 382px-wide Figma row.
const STEP_X = [0, 83, 166, 250, 335];
const LINE_X = [52, 134, 218, 303];
const LINE_W = 27;

type State = 'done' | 'active' | 'pending';

function StepIcon({ index, state }: { index: number; state: State }) {
  const on = state !== 'pending';
  const color = on ? colors.text : colors.textSecondary;
  switch (index) {
    case 0:
      return <StepCarIcon color={color} />;
    case 1:
      return <StepBoxIcon color={color} filled={on} />;
    case 2:
      return on ? <StepCalendarSolidIcon color={color} /> : <StepCalendarIcon color={color} />;
    case 3:
      return on ? <StepLocationFilledIcon color={color} /> : <StepLocationIcon color={color} />;
    default:
      return on ? <StepPaymentFilledIcon color={color} /> : <StepPaymentIcon color={color} />;
  }
}

function Connector({ index, filled, drawIn }: { index: number; filled: boolean; drawIn: boolean }) {
  const grow = useRef(new Animated.Value(filled && !drawIn ? 1 : 0)).current;

  useEffect(() => {
    if (!filled) return;
    Animated.timing(grow, { toValue: 1, duration: 450, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [filled, grow]);

  return (
    <View style={[styles.line, { left: LINE_X[index] }]}>
      <Animated.View
        style={[
          styles.lineFill,
          { width: grow.interpolate({ inputRange: [0, 1], outputRange: [0, LINE_W] }) },
        ]}
      />
    </View>
  );
}

type Props = { current: 0 | 1 | 2 | 3 | 4 };

/** Five-step progress row shown at the top of every booking screen. */
export default function BookingStepper({ current }: Props) {
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, speed: 12, bounciness: 14, delay: 150, useNativeDriver: true }).start();
  }, [pop]);

  return (
    <View style={styles.row}>
      {STEPS.map((label, i) => {
        const state: State = i < current ? 'done' : i === current ? 'active' : 'pending';
        return (
          <View key={label} style={[styles.step, { left: STEP_X[i] }]}>
            <Animated.View
              style={[
                styles.badge,
                state === 'active' && styles.badgeActive,
                state === 'done' && styles.badgeDone,
                state === 'pending' && styles.badgePending,
                state === 'active' && { transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] },
              ]}
            >
              <StepIcon index={i} state={state} />
            </Animated.View>
            <Text style={[styles.label, state === 'pending' && styles.labelPending]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        );
      })}
      {LINE_X.map((_, i) => (
        <Connector key={i} index={i} filled={i < current} drawIn={i === current - 1} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { height: 51, marginHorizontal: 24 },
  step: { position: 'absolute', top: 0, width: 47, alignItems: 'center', gap: 8 },
  badge: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  badgeActive: { backgroundColor: colors.primary },
  badgeDone: { borderWidth: 1, borderColor: colors.primary },
  badgePending: { backgroundColor: colors.border },
  label: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.text, textAlign: 'center' },
  labelPending: { color: colors.textSecondary },
  line: { position: 'absolute', top: 24, width: LINE_W, height: 2, borderRadius: 1, backgroundColor: colors.border, overflow: 'hidden' },
  lineFill: { height: 2, backgroundColor: colors.text },
});
