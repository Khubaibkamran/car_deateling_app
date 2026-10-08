import { useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/theme';
import { CalendarIcon, ClockIcon, PackageIcon, PinIcon } from '../../components/homeIcons';

type Props = { onPress?: () => void };

function Dot({ size }: { size: number }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.textSecondary }} />;
}

// Upcoming booking summary. Content is static for now, matching the design.
export default function BookingCard({ onPress }: Props) {
  const press = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(press, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 5 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={() => to(0.98)} onPressOut={() => to(1)}>
      <Animated.View style={[styles.card, { transform: [{ scale: press }] }]}>
        <View style={styles.top}>
          <View style={styles.person}>
            <View style={styles.avatar}>
              <Image source={require('../../../assets/images/home/avatar.jpg')} style={styles.avatarImage} />
            </View>
            <View style={styles.personText}>
              <Text style={styles.name}>
                Michael Carter <Text style={styles.role}>(Mechanic)</Text>
              </Text>
              <View style={styles.carRow}>
                <Text style={styles.small}>BMW M4 Series</Text>
                <Dot size={2} />
                <Text style={styles.small}>ABC1234</Text>
              </View>
            </View>
          </View>
          <View style={styles.chip}>
            <PinIcon size={16} color={colors.text} />
            <Text style={styles.chipText}>1287 N Alpine Dr</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <CalendarIcon />
            <Text style={styles.small}>Tomorrow</Text>
          </View>
          <Dot size={4} />
          <View style={styles.metaItem}>
            <ClockIcon />
            <Text style={styles.small}>10:00 AM</Text>
          </View>
          <Dot size={4} />
          <View style={styles.metaItem}>
            <PackageIcon />
            <Text style={styles.small}>Premium</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: 11,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  person: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.background,
    shadowColor: '#fff',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  // Figma crops the 3:2 portrait to the face: 183% wide, shifted left by two thirds of the box.
  avatarImage: { position: 'absolute', width: 66, height: 44, left: -24, top: 0 },
  personText: { height: 36, justifyContent: 'space-between', width: 156 },
  name: { fontFamily: 'Poppins_500Medium', fontSize: 12, lineHeight: 16, color: colors.white },
  role: { fontFamily: 'Poppins_500Medium_Italic', fontSize: 10 },
  carRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 130 },
  small: { fontFamily: 'Poppins_400Regular', fontSize: 10, color: colors.textSecondary },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: colors.blue,
  },
  chipText: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.white },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginTop: 12, marginBottom: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 16 },
});
