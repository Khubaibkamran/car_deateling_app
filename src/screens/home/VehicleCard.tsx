import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CarTabIcon } from '../../components/homeIcons';
import { colors } from '../../constants/theme';
import { Vehicle } from '../../types/vehicle';

type Props = {
  vehicle: Vehicle;
  selected: boolean;
  onPress: () => void;
};

function Dot() {
  return <View style={styles.dot} />;
}

export default function VehicleCard({ vehicle, selected, onPress }: Props) {
  const { image, imageBox, name, year, color, plate, stretch } = vehicle;
  const border = useRef(new Animated.Value(selected ? 1 : 0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Border colour can't use the native driver; the press scale below does.
    Animated.timing(border, {
      toValue: selected ? 1 : 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [selected, border]);

  const to = (v: number) => Animated.spring(press, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 5 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={() => to(0.98)} onPressOut={() => to(1)}>
      <Animated.View style={{ transform: [{ scale: press }] }}>
        <Animated.View
          style={[
            styles.card,
            { borderColor: border.interpolate({ inputRange: [0, 1], outputRange: [colors.border, colors.primary] }) },
          ]}
        >
          {image && imageBox ? (
            <Image source={image} style={[styles.image, imageBox]} resizeMode={stretch ? 'stretch' : 'cover'} />
          ) : (
            // Vehicles added in the app have no photo yet.
            <View style={[styles.image, styles.placeholder]}>
              <CarTabIcon color={colors.border} />
            </View>
          )}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <View style={styles.meta}>
              <Text style={styles.metaText}>{year}</Text>
              <Dot />
              <Text style={styles.metaText}>{color}</Text>
              <Dot />
              <Text style={styles.metaText}>{plate}</Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { height: 100, borderRadius: 12, borderWidth: 1, backgroundColor: colors.background },
  image: { position: 'absolute' },
  placeholder: { left: 5, top: 8, width: 172, height: 84, alignItems: 'center', justifyContent: 'center' },
  info: { position: 'absolute', left: 193, right: 12, top: 28, gap: 4 },
  name: { fontFamily: 'Poppins_500Medium', fontSize: 17, color: colors.white },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metaText: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.textSecondary },
  dot: { width: 2, height: 2, borderRadius: 1, backgroundColor: colors.textSecondary },
});
