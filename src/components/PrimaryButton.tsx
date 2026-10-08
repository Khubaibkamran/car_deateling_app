import { useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

type Props = {
  title: string;
  onPress?: () => void;
  /** `outline` is the orange-bordered secondary button. */
  variant?: 'solid' | 'outline';
  /** Shows a spinner in place of the label and ignores taps. */
  loading?: boolean;
};

export default function PrimaryButton({ title, onPress, variant = 'solid', loading = false }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => to(0.96)}
      onPressOut={() => to(1)}
      disabled={loading}
      accessibilityState={{ busy: loading }}
    >
      <Animated.View style={[styles.button, variant === 'solid' && styles.solid, { transform: [{ scale }] }]}>
        {loading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Animated.Text style={styles.text}>{title}</Animated.Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: { backgroundColor: colors.primary },
  text: { fontFamily: 'Poppins_500Medium', fontSize: 16, color: colors.text },
});
