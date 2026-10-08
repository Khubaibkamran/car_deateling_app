import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import BookingLayout from '../../components/BookingLayout';
import { ArrowLeftIcon, ArrowRightIcon } from '../../components/bookingIcons';
import FadeIn from '../../components/FadeIn';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../constants/theme';
import { isSameDay, monthGrid, monthLabel, toDateKey, WEEKDAYS } from '../../utils/calendar';

// The design's time slots (24h hour kept so a slot that has already passed today can be disabled).
const SLOTS = [
  { label: '02:00 PM', hour: 14 },
  { label: '04:00 PM', hour: 16 },
  { label: '06:00 PM', hour: 18 },
  { label: '07:00 PM', hour: 19 },
  { label: '10:00 PM', hour: 22 },
];

export type Schedule = { date: string; time: string };

type Props = {
  onBack?: () => void;
  onContinue?: (schedule: Schedule) => void;
};

function DayCell({
  day,
  selected,
  disabled,
  isToday,
  onPress,
}: {
  day: number | null;
  selected: boolean;
  disabled: boolean;
  isToday: boolean;
  onPress: () => void;
}) {
  const pop = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: selected ? 1 : 0, speed: 20, bounciness: 12, useNativeDriver: true }).start();
  }, [selected, pop]);

  if (day === null) return <View style={styles.cell} />;

  return (
    <Pressable onPress={onPress} disabled={disabled} style={styles.cell} accessibilityState={{ selected, disabled }}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.selectedBg,
          { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }] },
        ]}
      />
      <Text style={[styles.day, disabled && styles.dayDisabled, isToday && !selected && styles.dayToday, selected && styles.daySelected]}>
        {day}
      </Text>
    </Pressable>
  );
}

// Booking step 3 of 5: pick a date and a time.
export default function BookingScheduleScreen({ onBack, onContinue }: Props) {
  const { width } = useWindowDimensions();
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const slide = useRef(new Animated.Value(1)).current;
  const direction = useRef(1);

  const atCurrentMonth = view.year === today.getFullYear() && view.month === today.getMonth();
  const rows = useMemo(() => monthGrid(view.year, view.month), [view]);
  const startOfToday = useMemo(() => new Date(today.getFullYear(), today.getMonth(), today.getDate()), [today]);

  const changeMonth = (delta: 1 | -1) => {
    if (delta === -1 && atCurrentMonth) return;
    direction.current = delta;
    slide.setValue(0);
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
    Animated.timing(slide, { toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  };

  const slotDisabled = (hour: number) => !!date && isSameDay(date, today) && hour <= today.getHours();

  const pickDate = (day: number) => {
    const picked = new Date(view.year, view.month, day);
    setDate(picked);
    setShowError(false);
    // A time that's already gone by on the newly chosen day can't stay selected.
    const chosen = SLOTS.find((s) => s.label === slot);
    if (chosen && isSameDay(picked, today) && chosen.hour <= today.getHours()) setSlot(null);
  };

  const next = () => {
    if (!date || !slot) {
      setShowError(true);
      return;
    }
    onContinue?.({ date: toDateKey(date), time: slot });
  };

  const slotWidth = (width - 48 - 26) / 3;

  return (
    <BookingLayout step={2} onBack={onBack}>
      <FadeIn delay={250} style={styles.heading}>
        <Text style={styles.title}>Choose Date & Time</Text>
        <Text style={styles.subtitle}>When should we detail your car?</Text>
      </FadeIn>

      <FadeIn delay={350} distance={30} style={styles.calendar}>
        <View style={styles.monthRow}>
          <Pressable onPress={() => changeMonth(-1)} hitSlop={14} disabled={atCurrentMonth} style={atCurrentMonth && styles.faded}>
            <ArrowLeftIcon />
          </Pressable>
          <Text style={styles.month}>{monthLabel(view.year, view.month)}</Text>
          <Pressable onPress={() => changeMonth(1)} hitSlop={14}>
            <ArrowRightIcon />
          </Pressable>
        </View>

        <View style={styles.weekdays}>
          {WEEKDAYS.map((w) => (
            <View key={w} style={styles.cell}>
              <Text style={styles.weekday}>{w}</Text>
            </View>
          ))}
        </View>

        <Animated.View
          style={[
            styles.grid,
            {
              opacity: slide,
              transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [direction.current * 24, 0] }) }],
            },
          ]}
        >
          {rows.map((row, r) => (
            <View key={r} style={styles.week}>
              {row.map((day, c) => {
                const cellDate = day ? new Date(view.year, view.month, day) : null;
                return (
                  <DayCell
                    key={c}
                    day={day}
                    selected={!!cellDate && !!date && isSameDay(cellDate, date)}
                    disabled={!cellDate || cellDate < startOfToday}
                    isToday={!!cellDate && isSameDay(cellDate, today)}
                    onPress={() => day && pickDate(day)}
                  />
                );
              })}
            </View>
          ))}
        </Animated.View>
      </FadeIn>

      <View style={styles.slots}>
        {SLOTS.map((s, i) => {
          const disabled = slotDisabled(s.hour);
          const selected = slot === s.label;
          return (
            <FadeIn key={s.label} delay={550 + i * 70} distance={20}>
              <Pressable
                disabled={disabled}
                onPress={() => {
                  setSlot(s.label);
                  setShowError(false);
                }}
                style={[styles.slot, { width: slotWidth }, selected && styles.slotSelected, disabled && styles.slotDisabled]}
              >
                <Text style={[styles.slotText, selected && styles.slotTextSelected]}>{s.label}</Text>
              </Pressable>
            </FadeIn>
          );
        })}
      </View>

      <View style={styles.spacer} />
      <FadeIn delay={900} distance={40} style={styles.footer}>
        {showError && (
          <Text style={styles.error}>{!date ? 'Please choose a date.' : 'Please choose a time.'}</Text>
        )}
        <PrimaryButton title="Continue" onPress={next} />
      </FadeIn>
    </BookingLayout>
  );
}

const styles = StyleSheet.create({
  heading: { marginTop: 32, marginHorizontal: 24, gap: 4 },
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, letterSpacing: 0.36, color: colors.white },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.textSecondary },
  calendar: {
    marginTop: 21,
    marginHorizontal: 24,
    padding: 24,
    gap: 22,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#fff',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  monthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faded: { opacity: 0.3 },
  month: { fontFamily: 'Poppins_400Regular', fontSize: 14, lineHeight: 14, color: colors.white },
  weekdays: { flexDirection: 'row', justifyContent: 'space-between' },
  weekday: { fontFamily: 'Poppins_500Medium', fontSize: 10, letterSpacing: 1.5, color: '#B5BEC6' },
  grid: { gap: 8 },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  cell: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  selectedBg: { borderRadius: 29, backgroundColor: colors.text },
  day: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: colors.white },
  dayDisabled: { opacity: 0.3 },
  dayToday: { color: colors.primary },
  daySelected: { color: colors.primary },
  weekdayCell: { alignItems: 'center' },
  slots: { marginTop: 24, marginHorizontal: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 12, columnGap: 13 },
  slot: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotSelected: { borderColor: colors.primary },
  slotDisabled: { opacity: 0.3 },
  slotText: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.text },
  slotTextSelected: { color: colors.primary },
  spacer: { flex: 1 },
  footer: { paddingHorizontal: 24, paddingBottom: 50, gap: 8 },
  error: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.red, textAlign: 'center' },
});
