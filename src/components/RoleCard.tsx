import { useEffect, useRef } from 'react';
import { Animated, Easing, ImageSourcePropType, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

type Props = {
  image: ImageSourcePropType;
  grayImage: ImageSourcePropType;
  label: string;
  selected: boolean;
  onPress: () => void;
};

const DURATION = 320;

export default function RoleCard({ image, grayImage, label, selected, onPress }: Props) {
  // Border colour can't use the native driver, so it gets its own value.
  const border = useRef(new Animated.Value(selected ? 1 : 0)).current;
  const sel = useRef(new Animated.Value(selected ? 1 : 0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const config = { toValue: selected ? 1 : 0, duration: DURATION, easing: Easing.out(Easing.cubic) };
    Animated.timing(border, { ...config, useNativeDriver: false }).start();
    Animated.timing(sel, { ...config, useNativeDriver: true }).start();
  }, [selected, border, sel]);

  const to = (v: number) =>
    Animated.spring(press, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={() => to(0.97)} onPressOut={() => to(1)}>
      <Animated.View style={[styles.wrap, { transform: [{ scale: press }] }]}>
        <Animated.View
          style={[
            styles.card,
            { borderColor: border.interpolate({ inputRange: [0, 1], outputRange: [colors.background, colors.primary] }) },
          ]}
        >
          <Animated.View style={styles.imageBox}>
            <Animated.Image source={grayImage} style={styles.image} resizeMode="cover" />
            <Animated.Image source={image} style={[styles.image, { opacity: sel }]} resizeMode="cover" />
          </Animated.View>
        </Animated.View>
        <Animated.Text
          style={[
            styles.label,
            selected ? styles.labelSelected : styles.labelIdle,
            { opacity: sel.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) },
          ]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 10 },
  card: {
    width: 324,
    padding: 11, // + 1px border = the 12px inset in the design
    borderWidth: 1,
    borderRadius: 32,
  },
  imageBox: { width: 300, aspectRatio: 918 / 575, borderRadius: 20, overflow: 'hidden' },
  image: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  label: { fontSize: 16, color: colors.text, textAlign: 'center' },
  labelSelected: { fontFamily: 'Poppins_600SemiBold' },
  labelIdle: { fontFamily: 'Poppins_400Regular' },
});
