import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Alert } from '../../components/AppAlert';
import { addCard, deleteCard, getCards, makeDefaultCard } from '../../api/customer';
import { apiFieldErrors, apiMessage } from '../../api/errors';
import { ApiCard } from '../../api/types';
import AuthInput from '../../components/AuthInput';
import { TrashIcon } from '../../components/drawerIcons';
import FadeIn from '../../components/FadeIn';
import { PlusIcon } from '../../components/homeIcons';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import SelectField from '../../components/SelectField';
import StateView from '../../components/StateView';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { useApi } from '../../hooks/useApi';

const BRANDS = ['Visa', 'Mastercard', 'American Express'];
const MONTHS = Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, '0'));

type Props = {
  onBack?: () => void;
  /** When given, tapping a card picks it (used while paying) instead of making it the default. */
  onSelect?: (card: ApiCard) => void;
  selectedId?: number;
  /** Tells the app the list changed so other screens can refresh their copy. */
  onChanged?: () => void;
  /** Open straight on the "add card" form. */
  startAdding?: boolean;
};

// Saved cards: pick one, make one the default, remove one or add a new one.
export default function PaymentMethodsScreen({ onBack, onSelect, selectedId, onChanged, startAdding }: Props) {
  const { data: cards, loading, error, reload } = useApi(getCards, []);
  const [adding, setAdding] = useState(!!startAdding);
  const [busy, setBusy] = useState(false);

  const [brand, setBrand] = useState('Visa');
  const [last4, setLast4] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const years = useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => `${now + i}`);
  }, []);

  const lastOk = /^\d{4}$/.test(last4);
  const shown: Record<string, string> = {
    ...(submitted ? { last4: lastOk ? '' : 'Enter the last 4 digits.', exp: month && year ? '' : 'Choose the expiry date.' } : {}),
    ...errors,
  };

  const changed = async () => {
    await reload();
    onChanged?.();
  };

  const save = async () => {
    if (busy) return;
    setSubmitted(true);
    setErrors({});
    if (!lastOk || !month || !year) return;
    setBusy(true);
    try {
      const card = await addCard({
        brand,
        last4,
        exp_month: Number(month),
        exp_year: Number(year),
        is_default: !cards || cards.length === 0,
      });
      setAdding(false);
      setLast4('');
      setMonth('');
      setYear('');
      setSubmitted(false);
      await changed();
      onSelect?.(card);
    } catch (e) {
      const fields = apiFieldErrors(e);
      setErrors({
        last4: fields.last4 ?? '',
        exp: fields.exp_year ?? fields.exp_month ?? fields.non_field_errors ?? '',
        form: fields.detail ?? (Object.keys(fields).length ? '' : apiMessage(e)),
      });
    } finally {
      setBusy(false);
    }
  };

  const tap = async (card: ApiCard) => {
    if (onSelect) {
      onSelect(card);
      return;
    }
    if (card.is_default) return;
    try {
      await makeDefaultCard(card.id);
      await changed();
    } catch (e) {
      Alert.alert('Payment methods', apiMessage(e));
    }
  };

  const remove = (card: ApiCard) =>
    Alert.alert('Remove card', `Remove ${card.brand} •••• ${card.last4}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCard(card.id);
            await changed();
          } catch (e) {
            Alert.alert('Payment methods', apiMessage(e));
          }
        },
      },
    ]);

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title={adding ? 'Add Payment Method' : 'Payment Methods'} onBack={adding && cards?.length ? () => setAdding(false) : onBack} font="redhat" />
      </FadeIn>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {adding ? (
            <FadeIn delay={100} distance={20} style={styles.form}>
              <Text style={styles.subtitle}>For your security we only keep the card type, the last 4 digits and the expiry date.</Text>
              <View>
                <Text style={styles.label}>Card type</Text>
                <SelectField title="Card type" placeholder="Choose card type" value={brand} options={BRANDS} onChange={setBrand} />
              </View>
              <View>
                <Text style={styles.label}>Last 4 digits</Text>
                <AuthInput
                  placeholder="1234"
                  value={last4}
                  onChangeText={(t) => setLast4(t.replace(/\D/g, '').slice(0, 4))}
                  keyboardType="number-pad"
                  maxLength={4}
                  error={!!shown.last4}
                />
                {!!shown.last4 && <Text style={styles.error}>{shown.last4}</Text>}
              </View>
              <View>
                <Text style={styles.label}>Expiry</Text>
                <View style={styles.expiry}>
                  <View style={styles.flex}>
                    <SelectField title="Month" placeholder="MM" value={month} options={MONTHS} onChange={setMonth} error={!!shown.exp} />
                  </View>
                  <View style={styles.flex}>
                    <SelectField title="Year" placeholder="YYYY" value={year} options={years} onChange={setYear} error={!!shown.exp} />
                  </View>
                </View>
                {!!shown.exp && <Text style={styles.error}>{shown.exp}</Text>}
              </View>
              {!!shown.form && <Text style={styles.error}>{shown.form}</Text>}
              <PrimaryButton title="Save Card" onPress={save} loading={busy} />
            </FadeIn>
          ) : (
            <>
              <FadeIn delay={100} style={styles.headingRow}>
                <Text style={styles.subtitle}>{onSelect ? 'Choose the card to pay with' : 'Tap a card to make it your default'}</Text>
                <Pressable style={styles.add} hitSlop={10} onPress={() => setAdding(true)}>
                  <PlusIcon />
                  <Text style={styles.addText}>Add Card</Text>
                </Pressable>
              </FadeIn>

              <StateView loading={loading && !cards} error={cards ? undefined : error} onRetry={reload} />
              {cards && cards.length === 0 && (
                <FadeIn style={styles.empty}>
                  <Text style={styles.emptyTitle}>No cards yet</Text>
                  <Text style={styles.emptyText}>Add a card to pay for your bookings.</Text>
                </FadeIn>
              )}

              {(cards ?? []).map((card, i) => {
                const active = onSelect ? selectedId === card.id : card.is_default;
                return (
                  <FadeIn key={card.id} delay={150 + i * 70} distance={20}>
                    <Pressable onPress={() => tap(card)} style={[styles.card, active && styles.cardActive]}>
                      <View style={styles.cardText}>
                        <Text style={styles.cardNumber}>•••• {card.last4}</Text>
                        <Text style={styles.cardMeta}>
                          {card.brand} · Expires {`${card.exp_month}`.padStart(2, '0')}/{card.exp_year}
                        </Text>
                      </View>
                      {card.is_default && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>Default</Text>
                        </View>
                      )}
                      <Pressable onPress={() => remove(card)} hitSlop={10} accessibilityLabel={`Remove card ending ${card.last4}`}>
                        <TrashIcon />
                      </Pressable>
                    </Pressable>
                  </FadeIn>
                );
              })}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  flex: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 50, gap: 16 },
  form: { gap: 20 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  subtitle: { flex: 1, fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.textSecondary },
  add: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addText: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.primary },
  label: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.text, marginBottom: 8 },
  expiry: { flexDirection: 'row', gap: 12 },
  error: { fontFamily: 'Poppins_500Medium', fontSize: 11, color: colors.red, marginTop: 6, marginLeft: 4 },
  empty: { alignItems: 'center', gap: 4, paddingVertical: 40 },
  emptyTitle: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 16, color: colors.white },
  emptyText: { fontFamily: 'Poppins_400Regular', fontSize: 13, color: colors.textSecondary },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  cardActive: { borderColor: colors.primary },
  cardText: { flex: 1, gap: 2 },
  cardNumber: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: colors.text },
  cardMeta: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, backgroundColor: colors.blue },
  badgeText: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.text },
});
