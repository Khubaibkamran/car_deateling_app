import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SuccessBadge } from '../../components/flowIcons';
import { colors } from '../../constants/theme';
import { BookingSummary } from '../../types/booking';
import { formatBookingDate } from '../../utils/calendar';

type Props = {
  visible: boolean;
  summary: BookingSummary;
  onHome?: () => void;
  onViewBooking?: () => void;
};

function DashedLine() {
  return <View style={styles.dashed} />;
}

function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>
        {value}
        {note ? <Text style={styles.rowNote}> ({note})</Text> : null}
      </Text>
    </View>
  );
}

function OutlineButton({ title, onPress }: { title: string; onPress?: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  return (
    <Pressable style={styles.buttonSlot} onPress={onPress} onPressIn={() => to(0.95)} onPressOut={() => to(1)}>
      <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
        <Text style={styles.buttonText}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}

// Shown over the payment screen once the booking is paid for.
export default function BookingConfirmedModal({ visible, summary, onHome, onViewBooking }: Props) {
  const [mounted, setMounted] = useState(visible);
  const enter = useRef(new Animated.Value(0)).current; // backdrop + card
  const badge = useRef(new Animated.Value(0)).current; // success badge pop
  const content = useRef(new Animated.Value(0)).current; // text + rows
  const pulse = useRef(new Animated.Value(0)).current; // ring pulse behind the badge

  useEffect(() => {
    if (!visible) {
      setMounted(false);
      return;
    }
    setMounted(true);
    enter.setValue(0);
    badge.setValue(0);
    content.setValue(0);
    Animated.sequence([
      Animated.timing(enter, { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(badge, { toValue: 1, speed: 8, bounciness: 14, useNativeDriver: true }),
        Animated.timing(content, { toValue: 1, duration: 600, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
    const loop = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 1800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [visible, enter, badge, content, pulse]);

  const { vehicle, planTag, packageName, price } = summary;
  const tier = planTag.replace(/\s*plan$/i, '').toLowerCase();

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent onRequestClose={onHome}>
      <Animated.View style={[styles.backdrop, { opacity: enter }]} />
      <View style={styles.host} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.card,
            {
              opacity: enter,
              transform: [{ scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
            },
          ]}
        >
          <View style={styles.badgeWrap}>
            <Animated.View
              style={[
                styles.ring,
                {
                  opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
                  transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.5] }) }],
                },
              ]}
            />
            <Animated.View
              style={{
                opacity: badge,
                transform: [
                  { scale: badge.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
                  { rotate: badge.interpolate({ inputRange: [0, 1], outputRange: ['-25deg', '0deg'] }) },
                ],
              }}
            >
              <SuccessBadge />
            </Animated.View>
          </View>

          <Animated.View
            style={{
              opacity: content,
              transform: [{ translateY: content.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
            }}
          >
            <View style={styles.head}>
              <Text style={styles.title}>Booking Is Confirmed!</Text>
              <Text style={styles.subtitle}>Your car detailing service has been successfully scheduled.</Text>
            </View>

            <DashedLine />

            <View style={styles.rows}>
              <Row label="Service" value={packageName} note={tier} />
              <Row label="Service Fee" value={`$${price.toFixed(2)}`} />
              <Row label="Vehicle" value={vehicle.name} note={vehicle.plate} />
              <Row label="Date & Time" value={`${formatBookingDate(summary.date)} - ${summary.time}`} />
              <Row label="Location" value={summary.address} />
            </View>

            <DashedLine />

            <View style={styles.assign}>
              <View style={styles.assignRow}>
                <Text style={styles.rowLabel}>Technician Assignment</Text>
                <View style={styles.pending}>
                  <Text style={styles.pendingText}>Pending</Text>
                </View>
              </View>
              <Text style={styles.assignNote}>We&apos;ll notify you once a technician has been assigned to your booking.</Text>
            </View>

            <View style={styles.actions}>
              <OutlineButton title="Home" onPress={onHome} />
              <OutlineButton title="View Booking" onPress={onViewBooking} />
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)' },
  host: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 34 },
  card: {
    width: '100%',
    maxWidth: 362,
    borderRadius: 20,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingBottom: 24,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  badgeWrap: { height: 120, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  ring: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  head: { gap: 4, alignItems: 'center', marginTop: -4 },
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, color: colors.text, textAlign: 'center' },
  subtitle: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  dashed: {
    marginVertical: 12,
    height: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  rows: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  rowLabel: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.textSecondary },
  rowValue: { flexShrink: 1, fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.text, textAlign: 'right' },
  rowNote: { fontSize: 10 },
  assign: { gap: 8 },
  assignRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pending: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, backgroundColor: colors.blue },
  pendingText: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.text },
  assignNote: { fontFamily: 'Poppins_500Medium_Italic', fontSize: 10, color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: 16, marginTop: 24 },
  buttonSlot: { flex: 1 },
  button: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.text },
});
