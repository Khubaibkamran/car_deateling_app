import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import BeforeAfter from '../../components/BeforeAfter';
import { ChatSmallIcon, StarSolidIcon } from '../../components/extraIcons';
import FadeIn from '../../components/FadeIn';
import { CalendarLineIcon, ClockLightIcon, LocationFilledIcon } from '../../components/flowIcons';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import SignaturePad from '../../components/SignaturePad';
import StarRating from '../../components/StarRating';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { BookingSummary } from '../../types/booking';
import { formatBookingDate } from '../../utils/calendar';

const MAX_REVIEW = 500;
// Sample values from the design until the backend supplies the real job record.
const TECHNICIAN = { name: 'Alex Wilson', id: '0145425', role: 'Detailer', rating: 4.8 };
const JOB_DURATION = '2hr 30m';
const tire = require('../../../assets/images/splash/tire-bg.png');

export type ServiceFeedback = { rating: number; review: string; signed: boolean };

type Props = {
  summary: BookingSummary;
  onBack?: () => void;
  onComplete?: (feedback: ServiceFeedback) => void;
  onMessage?: () => void;
};

function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function Dot({ size }: { size: number }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.textSecondary }} />;
}

// Shown once the job is done: review the work, rate the technician and sign off.
export default function ServiceCompletedScreen({ summary, onBack, onComplete, onMessage }: Props) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [signed, setSigned] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [showError, setShowError] = useState(false);

  const { vehicle } = summary;

  const complete = () => {
    if (!signed) {
      setShowError(true);
      return;
    }
    onComplete?.({ rating, review: review.trim(), signed });
  };

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title="Service Completed" onBack={onBack} font="redhat" />
      </FadeIn>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!drawing}
        >
          <FadeIn delay={150} distance={24}>
            <Card style={styles.summaryCard}>
              <Image source={tire} style={styles.cardTire} />
              <Image source={require('../../../assets/images/payment/service-thumb.jpg')} style={styles.thumb} />
              <View style={styles.summaryText}>
                <Text style={styles.serviceName} numberOfLines={1}>
                  {summary.packageName}
                </Text>
                <Text style={styles.plan}>{summary.planTag}</Text>
              </View>
              <View style={styles.completed}>
                <Text style={styles.completedText}>Completed</Text>
              </View>
              <View style={styles.when}>
                <CalendarLineIcon />
                <Text style={styles.whenText}>
                  {formatBookingDate(summary.date)} - {summary.time}
                </Text>
                <Dot size={4} />
                <ClockLightIcon />
                <Text style={styles.whenText}>{JOB_DURATION}</Text>
              </View>
            </Card>
          </FadeIn>

          <FadeIn delay={250} distance={24}>
            <Card>
              <Text style={styles.cardTitle}>Vehicle</Text>
              <View style={styles.vehicleRow}>
                <View style={styles.vehicleThumb}>
                  {vehicle.image ? <Image source={vehicle.image} style={styles.vehicleImage} resizeMode="cover" /> : null}
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

          <FadeIn delay={350} distance={24}>
            <Card>
              <Text style={styles.cardTitle}>Before & After</Text>
              <View style={styles.compare}>
                <BeforeAfter
                  before={require('../../../assets/images/completed/before.jpg')}
                  after={require('../../../assets/images/completed/after.jpg')}
                  aspect={800 / 517}
                />
              </View>
            </Card>
          </FadeIn>

          <FadeIn delay={450} distance={24}>
            <Card>
              <Text style={styles.cardTitle}>Your Technician</Text>
              <View style={styles.techRow}>
                <View style={styles.techLeft}>
                  <View style={styles.techPhoto}>
                    <Image source={require('../../../assets/images/track/alex.jpg')} style={styles.techImage} />
                  </View>
                  <View style={styles.techInfo}>
                    <View style={styles.techNameRow}>
                      <Text style={styles.techName}>{TECHNICIAN.name}</Text>
                      <View style={styles.ratingBadge}>
                        <StarSolidIcon />
                        <Text style={styles.ratingBadgeText}>{TECHNICIAN.rating.toFixed(1)}</Text>
                      </View>
                    </View>
                    <View style={styles.techMeta}>
                      <Text style={styles.metaText}>ID:{TECHNICIAN.id}</Text>
                      <Dot size={2} />
                      <Text style={styles.metaText}>{TECHNICIAN.role}</Text>
                    </View>
                  </View>
                </View>
                <Pressable style={styles.chat} onPress={onMessage} accessibilityLabel="Message technician">
                  <ChatSmallIcon />
                </Pressable>
              </View>

              <View style={styles.divider} />

              <Text style={styles.feedbackTitle}>How was the service?</Text>
              <Text style={styles.feedbackSub}>Your feedback helps us improve & reward our technicians</Text>
              <View style={styles.stars}>
                <StarRating value={rating} onChange={setRating} />
              </View>
              <View style={styles.reviewBox}>
                <TextInput
                  value={review}
                  onChangeText={setReview}
                  placeholder="Share your experience"
                  placeholderTextColor={colors.textSecondary}
                  selectionColor={colors.primary}
                  style={styles.reviewInput}
                  multiline
                  maxLength={MAX_REVIEW}
                  textAlignVertical="top"
                />
                <Text style={styles.counter}>
                  {review.length}/{MAX_REVIEW}
                </Text>
              </View>
            </Card>
          </FadeIn>

          <FadeIn delay={550} distance={24}>
            <Card>
              <Text style={styles.cardTitle}>Confirm Completion</Text>
              <Text style={styles.confirmSub}>
                Please sign below to confirm that you are satisfied with the completed service
              </Text>
              <View style={styles.signature}>
                <SignaturePad
                  onChange={(has) => {
                    setSigned(has);
                    if (has) setShowError(false);
                  }}
                  onDrawingChange={setDrawing}
                />
              </View>
              {showError && <Text style={styles.error}>Please sign to confirm the service is complete.</Text>}
            </Card>
          </FadeIn>

          <FadeIn delay={650} distance={24}>
            <PrimaryButton title="Complete Service" onPress={complete} />
          </FadeIn>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  flex: { flex: 1 },
  content: { paddingTop: 50, paddingHorizontal: 24, paddingBottom: 50, gap: 16 },
  card: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.background,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  summaryCard: { height: 112 },
  cardTire: { position: 'absolute', right: 0, top: -60, width: 231, height: 231, opacity: 0.1 },
  thumb: { position: 'absolute', left: 16, top: 16, width: 80, height: 80, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  summaryText: { position: 'absolute', left: 104, top: 16, right: 110, gap: 4 },
  serviceName: { fontFamily: 'Poppins_500Medium', fontSize: 16, letterSpacing: -0.5, color: colors.text },
  plan: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.textSecondary },
  completed: {
    position: 'absolute',
    top: 16,
    right: 0,
    paddingLeft: 8,
    paddingRight: 12,
    paddingVertical: 4,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: colors.green,
  },
  completedText: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.text },
  when: { position: 'absolute', left: 104, top: 76, flexDirection: 'row', alignItems: 'center', gap: 4 },
  whenText: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
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
  address: { flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.text },
  compare: { marginTop: 12 },
  techRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  techLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  techPhoto: { width: 47, height: 46, borderRadius: 8, overflow: 'hidden' },
  // The design crops the 3:2 portrait to the face.
  techImage: { position: 'absolute', width: 91.5, height: 61, left: -35, top: -4.6 },
  techInfo: { gap: 6 },
  techNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  techName: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.white },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 20,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: colors.indigo,
  },
  ratingBadgeText: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.text },
  techMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chat: { width: 32, height: 32, borderRadius: 4, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  feedbackTitle: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.white },
  feedbackSub: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  stars: { alignItems: 'center', marginTop: 16 },
  reviewBox: {
    marginTop: 12,
    height: 146,
    borderRadius: 12,
    backgroundColor: colors.background,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#fff',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  reviewInput: { flex: 1, padding: 0, fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.text },
  counter: { alignSelf: 'flex-end', fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.textSecondary },
  confirmSub: { fontFamily: 'Poppins_400Regular', fontSize: 12, lineHeight: 17, color: colors.textSecondary, marginTop: 2 },
  signature: { marginTop: 16 },
  error: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.red, marginTop: 10, textAlign: 'center' },
});
