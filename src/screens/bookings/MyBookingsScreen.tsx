import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Alert } from '../../components/AppAlert';
import { cancelBooking, getBookings, payBooking } from '../../api/customer';
import { apiMessage } from '../../api/errors';
import { dayLabel, STATUS_LABEL, tierOf, timeLabel } from '../../api/mappers';
import { ApiBooking } from '../../api/types';
import FadeIn from '../../components/FadeIn';
import ScreenHeader from '../../components/ScreenHeader';
import StateView from '../../components/StateView';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { useApi } from '../../hooks/useApi';

type Scope = 'upcoming' | 'past';

const TABS: { key: Scope; label: string; empty: string }[] = [
  { key: 'upcoming', label: 'Upcoming', empty: 'Book a service and it will show up here.' },
  { key: 'past', label: 'Past', empty: 'Completed and cancelled bookings will show up here.' },
];

type Props = {
  onBack?: () => void;
  /** Opens the live tracking screen. */
  onTrack: (booking: ApiBooking) => void;
  /** Opens the review screen for a completed booking. */
  onReview: (booking: ApiBooking) => void;
  onReschedule: (booking: ApiBooking) => void;
};

function Action({ title, onPress, danger }: { title: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.action, danger && styles.actionDanger]} hitSlop={4}>
      <Text style={[styles.actionText, danger && styles.actionTextDanger]}>{title}</Text>
    </Pressable>
  );
}

// Every booking the customer made, with what they can still do to each one.
export default function MyBookingsScreen({ onBack, onTrack, onReview, onReschedule }: Props) {
  const [scope, setScope] = useState<Scope>('upcoming');
  const { data, loading, error, reload } = useApi(() => getBookings(scope), [scope]);
  const tab = TABS.find((t) => t.key === scope)!;

  const run = async (job: () => Promise<unknown>) => {
    try {
      await job();
      await reload();
    } catch (e) {
      Alert.alert('My Bookings', apiMessage(e));
    }
  };

  const cancel = (b: ApiBooking) =>
    Alert.alert('Cancel booking', `Cancel ${b.service.name} on ${dayLabel(b.scheduled_at)}?`, [
      { text: 'Keep it', style: 'cancel' },
      { text: 'Cancel booking', style: 'destructive', onPress: () => run(() => cancelBooking(b.id)) },
    ]);

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title="My Bookings" onBack={onBack} font="redhat" />
      </FadeIn>

      <FadeIn delay={150} style={styles.tabs}>
        {TABS.map((t) => {
          const active = t.key === scope;
          return (
            <Pressable key={t.key} onPress={() => setScope(t.key)} style={[styles.tab, active && styles.tabActive]}>
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </FadeIn>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        <StateView loading={loading && !data} error={data ? undefined : error} onRetry={reload} />
        {data && data.length === 0 && (
          <FadeIn style={styles.empty}>
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptyText}>{tab.empty}</Text>
          </FadeIn>
        )}
        {(data ?? []).map((b, i) => (
          <FadeIn key={b.id} delay={i * 60} distance={20}>
            <View style={styles.card}>
              <View style={styles.top}>
                {!!b.vehicle.photo && <Image source={{ uri: b.vehicle.photo }} style={styles.carPhoto} />}
                <View style={styles.titles}>
                  <Text style={styles.title} numberOfLines={1}>
                    {b.service.name} <Text style={styles.tier}>({tierOf(b.plan_tag)})</Text>
                  </Text>
                  <Text style={styles.small}>
                    {b.vehicle.name} · {b.vehicle.plate}
                  </Text>
                </View>
                <View style={[styles.status, b.status === 'cancelled' && styles.statusOff, b.status === 'completed' && styles.statusDone]}>
                  <Text style={styles.statusText}>{STATUS_LABEL[b.status]}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.small}>
                {dayLabel(b.scheduled_at)} · {timeLabel(b.scheduled_at)} · ${Number(b.price).toFixed(2)}
              </Text>
              <Text style={styles.small} numberOfLines={1}>
                {b.address}
              </Text>
              {!!b.technician && <Text style={styles.small}>Technician: {b.technician.full_name}</Text>}

              <View style={styles.actions}>
                {b.status === 'pending_payment' && <Action title="Pay now" onPress={() => run(() => payBooking(b.id))} />}
                {['confirmed', 'assigned', 'on_the_way', 'in_progress'].includes(b.status) && (
                  <Action title="Track" onPress={() => onTrack(b)} />
                )}
                {b.can_review && <Action title="Review" onPress={() => onReview(b)} />}
                {b.can_reschedule && <Action title="Reschedule" onPress={() => onReschedule(b)} />}
                {b.can_cancel && <Action title="Cancel" danger onPress={() => cancel(b)} />}
                {b.status === 'completed' && !b.can_review && <Action title="Details" onPress={() => onTrack(b)} />}
              </View>
            </View>
          </FadeIn>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  tabs: { marginTop: 24, marginHorizontal: 24, flexDirection: 'row', gap: 12 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.text, borderColor: colors.text },
  tabText: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.textSecondary },
  tabTextActive: { color: colors.background },
  list: { flex: 1, marginTop: 16 },
  listContent: { paddingHorizontal: 24, paddingBottom: 40, gap: 16 },
  empty: { alignItems: 'center', gap: 4, paddingVertical: 60 },
  emptyTitle: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 16, color: colors.white },
  emptyText: { fontFamily: 'Poppins_400Regular', fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  card: {
    borderRadius: 12,
    padding: 16,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: colors.background,
    shadowColor: '#fff',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  carPhoto: { width: 56, height: 40, borderRadius: 6 },
  titles: { flex: 1, gap: 2 },
  title: { fontFamily: 'Poppins_500Medium', fontSize: 15, color: colors.text },
  tier: { color: colors.primary },
  small: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
  status: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, backgroundColor: colors.blue },
  statusDone: { backgroundColor: colors.green },
  statusOff: { backgroundColor: colors.border },
  statusText: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.text },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  action: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: colors.primary },
  actionText: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.primary },
  actionDanger: { borderColor: colors.red },
  actionTextDanger: { color: colors.red },
});
