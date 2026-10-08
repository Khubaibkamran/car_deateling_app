import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BookingStepper from '../../components/BookingStepper';
import { ClockOutlineIcon, StarIcon } from '../../components/bookingIcons';
import FadeIn from '../../components/FadeIn';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { EXTERIOR_WASH, Plan } from '../../data/packages';

const YELLOW = '#FFCC00';

function PlanCard({ plan, selected, onPress }: { plan: Plan; selected: boolean; onPress: () => void }) {
  const border = useRef(new Animated.Value(selected ? 1 : 0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(border, {
      toValue: selected ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [selected, border]);

  const to = (v: number) => Animated.spring(press, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 5 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={() => to(0.98)} onPressOut={() => to(1)}>
      <Animated.View style={[styles.planWrap, { transform: [{ scale: press }] }]}>
        <Animated.View
          style={[
            styles.plan,
            {
              borderColor: border.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,255,255,0.12)', colors.primary] }),
            },
          ]}
        >
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              <Text style={styles.currency}>$</Text>
              <Text style={styles.dollars}>{plan.price}</Text>
              <Text style={styles.cents}>.00</Text>
            </Text>
            <View style={styles.duration}>
              <ClockOutlineIcon />
              <Text style={styles.durationText}>{plan.duration}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.planDescription}>{plan.description}</Text>
        </Animated.View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{plan.tag}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  onBack?: () => void;
  onContinue?: (selection: { packageId: string; planId: string }) => void;
};

// Booking step 2 of 5: choose a package plan.
export default function BookingServiceScreen({ onBack, onContinue }: Props) {
  const pkg = EXTERIOR_WASH;
  const [planId, setPlanId] = useState<string | undefined>();
  const [showError, setShowError] = useState(false);

  const next = () => {
    if (!planId) {
      setShowError(true);
      return;
    }
    onContinue?.({ packageId: pkg.id, planId });
  };

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title="Book a Service" onBack={onBack} font="redhat" />
      </FadeIn>

      <FadeIn delay={150} style={styles.stepper}>
        <BookingStepper current={1} />
      </FadeIn>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn delay={250} style={styles.heading}>
          <Text style={styles.title}>Choose Your Package</Text>
          <Text style={styles.subtitle}>Select the level of care your vehicle needs.</Text>
        </FadeIn>

        <FadeIn delay={350} distance={28} style={styles.hero}>
          <Image source={pkg.image} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.packageInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.packageName}>{pkg.name}</Text>
              <View style={styles.rating}>
                <StarIcon />
                <Text style={styles.ratingText}>{pkg.rating.toFixed(1)}</Text>
              </View>
            </View>
            <Text style={styles.packageDescription}>{pkg.description}</Text>
          </View>
        </FadeIn>

        <View style={styles.plans}>
          {pkg.plans.map((plan, i) => (
            <FadeIn key={plan.id} delay={480 + i * 110} distance={30}>
              <PlanCard
                plan={plan}
                selected={planId === plan.id}
                onPress={() => {
                  setPlanId(plan.id);
                  setShowError(false);
                }}
              />
            </FadeIn>
          ))}
        </View>

        <FadeIn delay={850} distance={30} style={styles.action}>
          {showError && <Text style={styles.error}>Please choose a plan to continue.</Text>}
          <PrimaryButton title="Continue" onPress={next} />
        </FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  stepper: { marginTop: 40 },
  scroll: { flex: 1, marginTop: 32 },
  content: { paddingHorizontal: 24, paddingBottom: 40, gap: 24 },
  heading: { gap: 4 },
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, letterSpacing: 0.36, color: colors.white },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.textSecondary },
  hero: { gap: 16, marginTop: -8 },
  heroImage: { width: '100%', height: 160, borderRadius: 12, backgroundColor: '#D9D9D9' },
  packageInfo: { gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  packageName: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, lineHeight: 30, color: colors.text },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: YELLOW,
  },
  ratingText: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.background },
  packageDescription: { fontFamily: 'Poppins_500Medium', fontSize: 14, lineHeight: 22, color: colors.textSecondary },
  plans: { gap: 16 },
  planWrap: { paddingTop: 12 },
  plan: {
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 15,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 12,
    shadowColor: '#fff',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { letterSpacing: 0.48, color: colors.text },
  currency: { fontFamily: 'Poppins_400Regular', fontSize: 15.48, color: 'rgba(255,255,255,0.7)' },
  dollars: { fontFamily: 'Poppins_600SemiBold', fontSize: 24, color: colors.text },
  cents: { fontFamily: 'Poppins_500Medium', fontSize: 12, letterSpacing: 0.24, color: 'rgba(255,255,255,0.7)' },
  duration: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  durationText: { fontFamily: 'Poppins_500Medium', fontSize: 14, letterSpacing: 0.28, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.border },
  planDescription: { fontFamily: 'Poppins_400Regular', fontSize: 14, lineHeight: 21, color: colors.text },
  tag: {
    position: 'absolute',
    top: 0,
    left: 16,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.white },
  action: { gap: 8, marginTop: 8 },
  error: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.red, textAlign: 'center' },
});
