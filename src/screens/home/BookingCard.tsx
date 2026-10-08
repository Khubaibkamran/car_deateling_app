import { useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AVATAR_PHOTO, dayLabel, STATUS_LABEL, STATUS_NOTE, STATUS_STEP, tierOf, timeLabel } from '../../api/mappers';
import { ApiBooking } from '../../api/types';
import { colors } from '../../constants/theme';
import { CalendarIcon, ClockIcon, PackageIcon, PinIcon } from '../../components/homeIcons';

type Props = { booking: ApiBooking; onPress?: () => void };

const STATUS_COLOR: Record<ApiBooking['status'], string> = {
  pending_payment: colors.primary,
  confirmed: '#FFCC00',
  assigned: colors.blue,
  on_the_way: colors.blue,
  in_progress: colors.green,
  completed: colors.green,
  cancelled: colors.red,
};

function Dot({ size }: { size: number }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.textSecondary }} />;
}

// The customer's next booking: who is coming, which car, where and when.
export default function BookingCard({ booking, onPress }: Props) {
  // Until someone accepts, show the technician the customer asked for.
  const tech = booking.technician ?? booking.requested_technician;
  const step = STATUS_STEP[booking.status];
  const statusColor = STATUS_COLOR[booking.status];
  const press = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(press, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 5 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={() => to(0.98)} onPressOut={() => to(1)}>
      <Animated.View style={[styles.card, { transform: [{ scale: press }] }]}>
        <View style={styles.top}>
          <View style={styles.person}>
            <View style={styles.avatar}>
              <Image source={tech?.photo ? { uri: tech.photo } : AVATAR_PHOTO} style={tech?.photo ? styles.avatarPhoto : styles.avatarImage} />
            </View>
            <View style={styles.personText}>
              <Text style={styles.name}>
                {tech ? tech.full_name : booking.service.name} <Text style={styles.role}>{booking.technician ? '(Technician)' : tech ? '(Requested)' : `(${STATUS_LABEL[booking.status]})`}</Text>
              </Text>
              <View style={styles.carRow}>
                <Text style={styles.small} numberOfLines={1}>{booking.vehicle.name}</Text>
                <Dot size={2} />
                <Text style={styles.small}>{booking.vehicle.plate}</Text>
              </View>
            </View>
          </View>
          <View style={styles.chip}>
            <PinIcon size={16} color={colors.text} />
            <Text style={styles.chipText} numberOfLines={1}>{booking.address.split(',')[0]}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <CalendarIcon />
            <Text style={styles.small}>{dayLabel(booking.scheduled_at)}</Text>
          </View>
          <Dot size={4} />
          <View style={styles.metaItem}>
            <ClockIcon />
            <Text style={styles.small}>{timeLabel(booking.scheduled_at)}</Text>
          </View>
          <Dot size={4} />
          <View style={styles.metaItem}>
            <PackageIcon />
            <Text style={styles.small}>{tierOf(booking.plan_tag)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statusRow}>
          <View style={styles.statusText}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusLabel, { color: statusColor }]}>{STATUS_LABEL[booking.status]}</Text>
            <Text style={styles.small} numberOfLines={1}>
              · {STATUS_NOTE[booking.status]}
            </Text>
          </View>
          <View style={styles.steps}>
            {[1, 2, 3, 4].map((n) => (
              <View key={n} style={[styles.step, n <= step && { backgroundColor: statusColor }]} />
            ))}
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 100,
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
  avatarPhoto: { position: 'absolute', width: 36, height: 36 },
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
  chipText: { maxWidth: 90, fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.white },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginTop: 12, marginBottom: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  statusText: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontFamily: 'Poppins_600SemiBold', fontSize: 11 },
  steps: { flexDirection: 'row', gap: 3 },
  step: { width: 14, height: 4, borderRadius: 2, backgroundColor: colors.border },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 16 },
});
