import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BookingLayout from '../../components/BookingLayout';
import FadeIn from '../../components/FadeIn';
import {
  AddLineIcon,
  CalendarLineIcon,
  ClockLightIcon,
  LocationFilledIcon,
  TickCircleIcon,
  VisaIcon,
} from '../../components/flowIcons';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../constants/theme';
import { BookingSummary } from '../../types/booking';
import { formatBookingDate } from '../../utils/calendar';
import BookingConfirmedModal from './BookingConfirmedModal';

type Props = {
  summary: BookingSummary;
  onBack?: () => void;
  onChangeVehicle?: () => void;
  onHome?: () => void;
  onViewBooking?: () => void;
};

const tire = require('../../../assets/images/splash/tire-bg.png');

function Card({ children, tireOverlay }: { children: React.ReactNode; tireOverlay?: boolean }) {
  return (
    <View style={styles.card}>
      {tireOverlay && <Image source={tire} style={styles.cardTire} />}
      {children}
    </View>
  );
}

function Dot({ size }: { size: number }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.textSecondary }} />;
}

// Booking step 5 of 5: review everything and pay.
export default function BookingPaymentScreen({ summary, onBack, onChangeVehicle, onHome, onViewBooking }: Props) {
  const [paying, setPaying] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // There's no payment provider connected yet, so paying only simulates a short delay.
  const pay = () => {
    setPaying(true);
    timer.current = setTimeout(() => {
      setPaying(false);
      setConfirmed(true);
    }, 1400);
  };

  const { vehicle, price } = summary;
  const [whole, cents = '00'] = price.toFixed(2).split('.');

  return (
    <BookingLayout step={4} onBack={onBack}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FadeIn delay={250} style={styles.heading}>
          <Text style={styles.title}>Review & Pay</Text>
          <Text style={styles.subtitle}>Review your booking details & complete your payment</Text>
        </FadeIn>

        <FadeIn delay={350} distance={28}>
          <Card tireOverlay>
            <View style={styles.serviceRow}>
              <Image source={require('../../../assets/images/payment/service-thumb.jpg')} style={styles.thumb} />
              <View style={styles.serviceInfo}>
                <View style={styles.serviceTop}>
                  <View style={styles.serviceNames}>
                    <Text style={styles.serviceName} numberOfLines={1}>
                      {summary.packageName}
                    </Text>
                    <Text style={styles.plan}>{summary.planTag}</Text>
                  </View>
                  <Text style={styles.price}>
                    <Text style={styles.currency}>$</Text>
                    <Text style={styles.dollars}>{whole}</Text>
                    <Text style={styles.cents}>.{cents}</Text>
                  </Text>
                </View>
                <View style={styles.when}>
                  <CalendarLineIcon />
                  <Text style={styles.whenText}>{formatBookingDate(summary.date)}</Text>
                  <Dot size={4} />
                  <ClockLightIcon />
                  <Text style={styles.whenText}>{summary.time}</Text>
                </View>
              </View>
            </View>
          </Card>
        </FadeIn>

        <FadeIn delay={470} distance={28}>
          <Card>
            <Text style={styles.cardTitle}>Vehicle Details</Text>
            <View style={styles.vehicleRow}>
              <View style={styles.vehicleLeft}>
                <View style={styles.vehicleThumb}>
                  {vehicle.image ? (
                    <Image source={vehicle.image} style={styles.vehicleImage} resizeMode="cover" />
                  ) : null}
                </View>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName} numberOfLines={1}>
                    {vehicle.name}
                  </Text>
                  <View style={styles.vehicleMeta}>
                    <Text style={styles.metaText}>{vehicle.year}</Text>
                    <Dot size={2} />
                    <Text style={styles.metaText}>{vehicle.color}</Text>
                    <Dot size={2} />
                    <Text style={styles.metaText}>{vehicle.plate}</Text>
                  </View>
                </View>
              </View>
              <Pressable onPress={onChangeVehicle} hitSlop={10}>
                <Text style={styles.change}>Change</Text>
              </Pressable>
            </View>

            <View style={styles.divider} />

            <Text style={styles.cardTitle}>Location</Text>
            <View style={styles.locationRow}>
              <LocationFilledIcon />
              <Text style={styles.address} numberOfLines={2}>
                {summary.address}
              </Text>
            </View>
          </Card>
        </FadeIn>

        <FadeIn delay={590} distance={28}>
          <Card>
            <View style={styles.methodHeader}>
              <Text style={styles.cardTitle}>Payment Method</Text>
              <Pressable hitSlop={10}>
                <Text style={styles.change}>Change</Text>
              </Pressable>
            </View>
            <View style={styles.methodRow}>
              <View style={styles.methodLeft}>
                <View style={styles.visaTile}>
                  <VisaIcon />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.cardNumber}>**** 4242</Text>
                  <Text style={styles.cardType}>Credit card</Text>
                </View>
              </View>
              <TickCircleIcon />
            </View>
            <View style={styles.divider} />
            <Pressable style={styles.addMethod} hitSlop={8}>
              <AddLineIcon />
              <Text style={styles.addText}>Add Payment Method</Text>
            </Pressable>
          </Card>
        </FadeIn>
      </ScrollView>

      <FadeIn delay={750} distance={40} style={styles.footer}>
        <PrimaryButton title={`Pay $${price.toFixed(2)}`} onPress={pay} loading={paying} />
      </FadeIn>

      <BookingConfirmedModal visible={confirmed} summary={summary} onHome={onHome} onViewBooking={onViewBooking} />
    </BookingLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, marginTop: 32 },
  content: { paddingHorizontal: 24, paddingBottom: 24, gap: 16 },
  heading: { gap: 4, marginBottom: 5 },
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, letterSpacing: 0.36, color: colors.white },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.textSecondary },
  card: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.background,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#fff',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  cardTire: { position: 'absolute', right: 4, top: -60, width: 231, height: 231, opacity: 0.1 },
  cardTitle: { fontFamily: 'Poppins_500Medium', fontSize: 16, color: colors.white },
  serviceRow: { flexDirection: 'row', gap: 12 },
  thumb: { width: 80, height: 80, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  serviceInfo: { flex: 1, gap: 11 },
  serviceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  serviceNames: { flex: 1, gap: 4, paddingRight: 8 },
  serviceName: { fontFamily: 'Poppins_500Medium', fontSize: 16, letterSpacing: -0.5, color: colors.text },
  plan: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.textSecondary },
  price: { letterSpacing: 0.48, color: colors.text },
  currency: { fontFamily: 'Poppins_400Regular', fontSize: 15.48, color: 'rgba(255,255,255,0.7)' },
  dollars: { fontFamily: 'Poppins_600SemiBold', fontSize: 24, color: colors.text },
  cents: { fontFamily: 'Poppins_500Medium', fontSize: 12, letterSpacing: 0.24, color: 'rgba(255,255,255,0.7)' },
  when: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  whenText: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  vehicleLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16 },
  vehicleThumb: {
    width: 47,
    height: 46,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  vehicleImage: { width: '100%', height: '100%' },
  vehicleInfo: { flex: 1, gap: 2 },
  vehicleName: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.white },
  vehicleMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metaText: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.textSecondary },
  change: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.blue },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  address: { flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.text },
  methodHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  methodRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  visaTile: {
    width: 47,
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  methodInfo: { gap: 4 },
  cardNumber: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.white },
  cardType: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.textSecondary },
  addMethod: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  addText: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.blue },
  footer: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 50 },
});
