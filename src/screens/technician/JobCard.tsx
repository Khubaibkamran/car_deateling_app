import { useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { UserSmallIcon } from '../../components/extraIcons';
import { CalendarIcon, ClockIcon, PinIcon } from '../../components/homeIcons';
import { colors } from '../../constants/theme';
import { Job } from '../../data/jobs';

function Dot({ size }: { size: number }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.textSecondary }} />;
}

type Props = { job: Job; onPress?: () => void };

// One upcoming job: service + vehicle, pickup address and when/who.
export default function JobCard({ job, onPress }: Props) {
  const press = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(press, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 5 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={() => to(0.98)} onPressOut={() => to(1)}>
      <Animated.View style={[styles.card, { transform: [{ scale: press }] }]}>
        <View style={styles.top}>
          <View style={styles.left}>
            <View style={styles.thumb}>
              <Image source={job.image} style={styles.thumbImage} />
            </View>
            <View style={styles.titles}>
              <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                {job.title} <Text style={styles.tier}>({job.tier})</Text>
              </Text>
              <View style={styles.vehicleRow}>
                <Text style={styles.small}>{job.vehicle}</Text>
                <Dot size={2} />
                <Text style={styles.small}>{job.plate}</Text>
              </View>
            </View>
          </View>
          <View style={styles.chip}>
            <PinIcon size={16} color={colors.text} />
            <Text style={styles.chipText}>{job.address}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <CalendarIcon />
            <Text style={styles.small}>{job.when}</Text>
          </View>
          <Dot size={4} />
          <View style={styles.metaItem}>
            <ClockIcon />
            <Text style={styles.small}>{job.time}</Text>
          </View>
          <Dot size={4} />
          <View style={styles.metaItem}>
            <UserSmallIcon />
            <Text style={styles.small}>{job.customer}</Text>
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
  left: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: {
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
  // The design crops the 3:2 photo: 183% wide, shifted left by two thirds of the box.
  thumbImage: { position: 'absolute', width: 66, height: 44, left: -24, top: 0 },
  titles: { height: 36, justifyContent: 'space-between', flexShrink: 1 },
  title: { fontFamily: 'Poppins_500Medium', fontSize: 12, lineHeight: 16, letterSpacing: -0.12, color: colors.white },
  tier: { fontFamily: 'Poppins_500Medium_Italic', fontSize: 10, letterSpacing: 0 },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
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
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 16 },
});
