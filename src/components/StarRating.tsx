import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { RatingStarIcon } from './extraIcons';

type Props = { value: number; onChange: (value: number) => void; max?: number };

function Star({ filled, onPress, label }: { filled: boolean; onPress: () => void; label: string }) {
  const pop = useRef(new Animated.Value(1)).current;
  const first = useRef(true);

  useEffect(() => {
    // Pop whenever a star becomes filled, but not on first render.
    if (first.current) {
      first.current = false;
      return;
    }
    if (!filled) return;
    pop.setValue(0.6);
    Animated.spring(pop, { toValue: 1, speed: 20, bounciness: 16, useNativeDriver: true }).start();
  }, [filled, pop]);

  return (
    <Pressable onPress={onPress} hitSlop={6} accessibilityRole="button" accessibilityLabel={label}>
      <Animated.View style={{ transform: [{ scale: pop }] }}>
        <RatingStarIcon filled={filled} />
      </Animated.View>
    </Pressable>
  );
}

export default function StarRating({ value, onChange, max = 5 }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: max }, (_, i) => (
        <Star key={i} filled={i < value} onPress={() => onChange(i + 1)} label={`${i + 1} star${i === 0 ? '' : 's'}`} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { width: 236, flexDirection: 'row', justifyContent: 'space-between' },
});
