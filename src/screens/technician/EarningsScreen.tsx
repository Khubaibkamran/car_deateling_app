import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Alert } from '../../components/AppAlert';
import AppHeader from '../../components/AppHeader';
import { WalletTabIcon } from '../../components/extraIcons';
import FadeIn from '../../components/FadeIn';
import GlowCard from '../../components/GlowCard';
import ModalCard from '../../components/ModalCard';
import PrimaryButton from '../../components/PrimaryButton';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { apiMessage } from '../../api/errors';
import { stampLabel } from '../../api/mappers';
import { getEarnings, withdraw as requestWithdraw } from '../../api/technician';
import StateView from '../../components/StateView';
import { Payment, Period } from '../../data/earnings';
import { useApi } from '../../hooks/useApi';

const NAV_HEIGHT = 100;
const CHART_HEIGHT = 120;

const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function Bar({ label, amount, max, highlight }: { label: string; amount: number; max: number; highlight: boolean }) {
  const h = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Heights can't use the native driver, which is fine for a handful of bars.
    Animated.timing(h, {
      toValue: max === 0 ? 0 : Math.max(amount > 0 ? 6 : 3, (amount / max) * CHART_HEIGHT),
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [amount, max, h]);

  return (
    <View style={styles.barCol}>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.bar, highlight && styles.barHighlight, { height: h }]} />
      </View>
      <Text style={[styles.barLabel, highlight && styles.barLabelHighlight]}>{label}</Text>
    </View>
  );
}

type Props = {
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
  notifications?: number;
};

// Wallet: what you can withdraw, how the week/month went, and each payment.
export default function EarningsScreen({ onMenuPress, onNotificationsPress, notifications }: Props) {
  const [period, setPeriod] = useState<Period>('week');
  const [confirming, setConfirming] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const { data, loading, error, reload } = useApi(() => getEarnings(period), [period]);

  const bars = (data?.bars ?? []).map((b) => ({ label: b.label, amount: Number(b.amount) }));
  const total = Number(data?.total ?? 0);
  const max = Math.max(0, ...bars.map((b) => b.amount));
  const jobs = data?.jobs_done ?? 0;
  const balance = Number(data?.balance ?? 0);
  const pending = Number(data?.pending ?? 0);

  // Earnings first, then what was already paid out, newest first.
  const payments: Payment[] = [
    ...(data?.payments ?? []).map((p) => ({
      id: `e${p.id}`,
      title: p.title,
      customer: p.customer,
      date: stampLabel(p.created_at),
      amount: Number(p.amount),
      pending: p.pending,
    })),
    ...(data?.withdrawals ?? []).map((w) => ({
      id: `w${w.id}`,
      title: w.method_label ? `Payout to ${w.method_label}` : 'Payout',
      customer: w.status === 'paid' ? 'Paid' : 'Requested',
      date: stampLabel(w.requested_at),
      amount: -Number(w.amount),
    })),
  ];

  const withdraw = async () => {
    if (withdrawing) return;
    setWithdrawing(true);
    try {
      await requestWithdraw();
      setConfirming(false);
      await reload();
    } catch (e) {
      setConfirming(false);
      Alert.alert('Withdraw', apiMessage(e, 'Could not request the withdrawal. Please try again.'));
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <AppHeader onMenuPress={onMenuPress} onNotificationsPress={onNotificationsPress} notifications={notifications} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FadeIn delay={150} style={styles.heading}>
          <Text style={styles.title}>Earnings</Text>
          <Text style={styles.subtitle}>Track what you’ve earned and withdraw it</Text>
        </FadeIn>

        <StateView loading={loading && !data} error={data ? undefined : error} onRetry={reload} />
        <FadeIn delay={250} distance={24}>
          <GlowCard tire>
            <Text style={styles.cardLabel}>Available balance</Text>
            <Text style={styles.balance}>{money(balance)}</Text>
            <View style={styles.balanceFooter}>
              <Text style={styles.hint}>
                {balance > 0 ? 'Ready to withdraw' : pending > 0 ? `${money(pending)} becomes available in 24 hours` : 'Nothing to withdraw yet'}
              </Text>
              <Pressable
                onPress={() => setConfirming(true)}
                disabled={balance <= 0}
                style={({ pressed }) => [styles.withdraw, balance <= 0 && styles.withdrawOff, pressed && styles.pressed]}
                accessibilityRole="button"
              >
                <Text style={styles.withdrawText}>Withdraw</Text>
              </Pressable>
            </View>
          </GlowCard>
        </FadeIn>

        <FadeIn delay={350} distance={24} style={styles.periods}>
          {(['week', 'month'] as const).map((p) => (
            <Pressable key={p} onPress={() => setPeriod(p)} style={[styles.chip, period === p && styles.chipActive]}>
              <Text style={[styles.chipText, period === p && styles.chipTextActive]}>
                {p === 'week' ? 'This Week' : 'This Month'}
              </Text>
            </Pressable>
          ))}
        </FadeIn>

        <FadeIn delay={420} distance={24}>
          <GlowCard>
            <Text style={styles.cardLabel}>Total earned</Text>
            <Text style={styles.total}>{money(total)}</Text>
            <View style={styles.chart}>
              {bars.map((b) => (
                <Bar key={`${period}-${b.label}`} label={b.label} amount={b.amount} max={max} highlight={b.amount === max && max > 0} />
              ))}
            </View>
          </GlowCard>
        </FadeIn>

        <FadeIn delay={490} distance={24} style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{jobs}</Text>
            <Text style={styles.statLabel}>Jobs done</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{money(Number(data?.average_per_job ?? 0))}</Text>
            <Text style={styles.statLabel}>Avg per job</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{Number(data?.rating ?? 0).toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </FadeIn>

        <FadeIn delay={560} distance={24} style={styles.payments}>
          <Text style={styles.sectionTitle}>Recent Payments</Text>
          {payments.map((p) => {
            const out = p.amount < 0;
            return (
              <View key={p.id} style={styles.payment}>
                <View style={styles.paymentIcon}>
                  <WalletTabIcon color={out ? colors.textSecondary : colors.primary} />
                </View>
                <View style={styles.paymentText}>
                  <Text style={styles.paymentTitle} numberOfLines={1}>
                    {p.title}
                  </Text>
                  <Text style={styles.paymentSub} numberOfLines={1}>
                    {p.customer} · {p.date}
                  </Text>
                </View>
                <View style={styles.paymentAmount}>
                  <Text style={[styles.amount, out && styles.amountOut]}>
                    {out ? '-' : '+'}
                    {money(Math.abs(p.amount))}
                  </Text>
                  {p.pending && <Text style={styles.pending}>Pending</Text>}
                </View>
              </View>
            );
          })}
        </FadeIn>
      </ScrollView>

      <ModalCard visible={confirming} onRequestClose={() => setConfirming(false)} dismissOnBackdrop>
        <Text style={styles.modalTitle}>Withdraw {money(balance)}?</Text>
        <Text style={styles.modalText}>We’ll send everything that’s available to your account. It usually arrives within 1–2 business days.</Text>
        <View style={styles.modalActions}>
          <View style={styles.modalButton}>
            <PrimaryButton title="Cancel" variant="outline" onPress={() => setConfirming(false)} />
          </View>
          <View style={styles.modalButton}>
            <PrimaryButton title="Confirm" onPress={withdraw} loading={withdrawing} />
          </View>
        </View>
      </ModalCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  scroll: { flex: 1 },
  content: { paddingTop: 32, paddingHorizontal: 24, paddingBottom: NAV_HEIGHT + 24, gap: 16 },
  heading: { gap: 4 },
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, letterSpacing: 0.36, color: colors.white },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.textSecondary },
  cardLabel: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
  balance: { fontFamily: 'RedHatDisplay_700Bold', fontSize: 36, letterSpacing: 1, color: colors.white, marginTop: 4 },
  balanceFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  hint: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.textSecondary },
  withdraw: { height: 40, paddingHorizontal: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  withdrawOff: { opacity: 0.35 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  withdrawText: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.text },
  periods: { flexDirection: 'row', gap: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.text, borderColor: colors.text },
  chipText: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.textSecondary },
  chipTextActive: { color: colors.background },
  total: { fontFamily: 'RedHatDisplay_700Bold', fontSize: 24, letterSpacing: 1, color: colors.white, marginTop: 2 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 20, gap: 8 },
  barCol: { flex: 1, alignItems: 'center', gap: 8 },
  barTrack: { height: CHART_HEIGHT, width: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: '70%', maxWidth: 28, borderRadius: 6, backgroundColor: colors.border },
  barHighlight: { backgroundColor: colors.primary },
  barLabel: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.textSecondary },
  barLabelHighlight: { color: colors.text },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, backgroundColor: colors.background, gap: 2 },
  statValue: { fontFamily: 'RedHatDisplay_700Bold', fontSize: 20, color: colors.white },
  statLabel: { fontFamily: 'Poppins_400Regular', fontSize: 11, color: colors.textSecondary },
  payments: { gap: 12, marginTop: 8 },
  sectionTitle: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, letterSpacing: 0.36, color: colors.white },
  payment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
    transform: [{ scale: 0.8 }],
  },
  paymentText: { flex: 1, gap: 2 },
  paymentTitle: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.text },
  paymentSub: { fontFamily: 'Poppins_400Regular', fontSize: 11, color: colors.textSecondary },
  paymentAmount: { alignItems: 'flex-end', gap: 2 },
  amount: { fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: colors.green },
  amountOut: { color: colors.textSecondary },
  pending: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.primary },
  modalTitle: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, color: colors.text, textAlign: 'center' },
  modalText: { fontFamily: 'Poppins_500Medium', fontSize: 12, lineHeight: 18, color: colors.textSecondary, textAlign: 'center', marginTop: 6 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalButton: { flex: 1 },
});
