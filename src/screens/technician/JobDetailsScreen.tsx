import { Image, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FadeIn from '../../components/FadeIn';
import { CalendarLineIcon, ClockLightIcon, LocationFilledIcon } from '../../components/flowIcons';
import GlowCard from '../../components/GlowCard';
import { ChatBubbleIcon } from '../../components/jobIcons';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { JobDetail } from '../../data/jobDetails';

type Props = {
  job: JobDetail;
  onBack?: () => void;
  onStart?: () => void;
  onMessageCustomer?: () => void;
};

function Dot() {
  return <View style={styles.dot} />;
}

function openInMaps(job: JobDetail) {
  const { latitude, longitude, address } = job;
  const label = encodeURIComponent(address);
  const url = Platform.select({
    ios: `maps:?q=${label}&ll=${latitude},${longitude}`,
    default: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
  });
  Linking.openURL(url).catch(() => undefined);
}

// What the technician sees before heading out: the service, the car, the customer and what's included.
export default function JobDetailsScreen({ job, onBack, onStart, onMessageCustomer }: Props) {
  const [whole, cents] = job.price.toFixed(2).split('.');
  const { vehicle, customer, payment } = job;

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title="Job Details" onBack={onBack} font="redhat" />
      </FadeIn>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FadeIn delay={150} distance={24}>
          <GlowCard tire>
            <View style={styles.serviceRow}>
              <Image source={require('../../../assets/images/payment/service-thumb.jpg')} style={styles.thumb} />
              <View style={styles.serviceInfo}>
                <View style={styles.serviceTop}>
                  <View style={styles.serviceNames}>
                    <Text style={styles.serviceName} numberOfLines={1}>
                      {job.service}
                    </Text>
                    <Text style={styles.plan}>{job.plan}</Text>
                  </View>
                  <Text style={styles.price}>
                    <Text style={styles.currency}>$</Text>
                    <Text style={styles.dollars}>{whole}</Text>
                    <Text style={styles.cents}>.{cents}</Text>
                  </Text>
                </View>
                <View style={styles.when}>
                  <CalendarLineIcon />
                  <Text style={styles.whenText}>{job.date}</Text>
                  <Dot />
                  <ClockLightIcon />
                  <Text style={styles.whenText}>{job.time}</Text>
                </View>
              </View>
            </View>
          </GlowCard>
        </FadeIn>

        <FadeIn delay={250} distance={24}>
          <GlowCard>
            <Text style={styles.cardTitle}>Vehicle Details</Text>
            <View style={styles.vehicleRow}>
              <View style={styles.vehicleThumb}>
                <Image source={vehicle.image} style={styles.vehicleImage} resizeMode="cover" />
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>{vehicle.name}</Text>
                <View style={styles.vehicleMeta}>
                  <Text style={styles.metaText}>{vehicle.year}</Text>
                  <Dot />
                  <Text style={styles.metaText}>{vehicle.color}</Text>
                  <Dot />
                  <Text style={styles.metaText}>{vehicle.plate}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.cardTitle}>Location</Text>
            <Pressable style={styles.locationRow} onPress={() => openInMaps(job)} accessibilityLabel="Open address in maps">
              <LocationFilledIcon />
              <Text style={styles.address} numberOfLines={2}>
                {job.address}
              </Text>
            </Pressable>
          </GlowCard>
        </FadeIn>

        <FadeIn delay={350} distance={24}>
          <GlowCard>
            <Text style={styles.cardTitle}>Customer</Text>
            <View style={styles.customerRow}>
              <View style={styles.customerLeft}>
                <Image source={customer.photo} style={styles.avatar} />
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{customer.name}</Text>
                  <Text style={styles.metaText}>ID:{customer.id}</Text>
                </View>
              </View>
              <Pressable style={styles.chat} onPress={onMessageCustomer} accessibilityLabel="Message customer">
                <ChatBubbleIcon />
              </Pressable>
            </View>

            <View style={styles.divider} />

            <Text style={styles.cardTitle}>Payment</Text>
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>Method</Text>
              <Text style={styles.payValue}>{payment.method}</Text>
            </View>
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>Status</Text>
              <View style={[styles.status, payment.status === 'Pending' && styles.statusPending]}>
                <Text style={styles.statusText}>{payment.status}</Text>
              </View>
            </View>
          </GlowCard>
        </FadeIn>

        <FadeIn delay={450} distance={24}>
          <GlowCard>
            <Text style={styles.cardTitle}>Service Details</Text>
            <View style={styles.bullets}>
              {job.details.map((line) => (
                <View key={line} style={styles.bullet}>
                  <Text style={styles.bulletMark}>•</Text>
                  <Text style={styles.bulletText}>{line}</Text>
                </View>
              ))}
            </View>
          </GlowCard>
        </FadeIn>

        <FadeIn delay={550} distance={30}>
          {/* The job-details design is cropped before its action button, so "Start Job" is my addition. */}
          <PrimaryButton title="Start Job" onPress={onStart} />
        </FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  scroll: { flex: 1, marginTop: 24 },
  content: { paddingHorizontal: 24, paddingBottom: 50, gap: 16 },
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
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textSecondary },
  cardTitle: { fontFamily: 'Poppins_500Medium', fontSize: 16, color: colors.white },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12 },
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
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  address: { flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.text, textDecorationLine: 'underline' },
  customerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  customerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 8 },
  customerInfo: { gap: 2 },
  customerName: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.white },
  chat: { width: 32, height: 32, borderRadius: 4, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  payRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  payLabel: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.textSecondary },
  payValue: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.text },
  status: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, backgroundColor: colors.green },
  statusPending: { backgroundColor: colors.blue },
  statusText: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.text },
  bullets: { gap: 8, marginTop: 12 },
  bullet: { flexDirection: 'row', gap: 8 },
  bulletMark: { fontFamily: 'Poppins_500Medium', fontSize: 12, lineHeight: 18, color: colors.textSecondary },
  bulletText: { flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 12, lineHeight: 18, color: colors.text },
});
