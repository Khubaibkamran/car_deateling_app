import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';
import { CheckIcon } from './icons';

type Props = { checked: boolean; onChange: (checked: boolean) => void };

export default function Checkbox({ checked, onChange }: Props) {
  const v = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(v, { toValue: checked ? 1 : 0, speed: 24, bounciness: 10, useNativeDriver: true }).start();
  }, [checked, v]);

  return (
    <Pressable onPress={() => onChange(!checked)} hitSlop={10} accessibilityRole="checkbox" accessibilityState={{ checked }}>
      <Animated.View style={[styles.box, checked ? styles.boxOn : styles.boxOff]}>
        <Animated.View style={{ opacity: v, transform: [{ scale: v }] }}>
          <CheckIcon />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: { width: 20, height: 20, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.text },
  boxOff: { borderWidth: 1, borderColor: colors.border },
});
