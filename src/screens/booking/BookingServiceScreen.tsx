import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BookingStepper from '../../components/BookingStepper';
import { ClockOutlineIcon, StarIcon } from '../../components/bookingIcons';
import FadeIn from '../../components/FadeIn';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { getService, getServices } from '../../api/customer';
import { PACKAGE_PHOTO, planFromApi, serviceFromApi } from '../../api/mappers';
import StateView from '../../components/StateView';
import { Plan } from '../../data/packages';
import { useApi } from '../../hooks/useApi';

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
              <Text style={styles.dollars}>{Math.floor(plan.price)}</Text>
              <Text style={styles.cents}>.{plan.price.toFixed(2).split('.')[1]}</Text>
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

export type ChosenPlan = { serviceId: string; serviceName: string; plan: Plan };

type Props = {
  /** Skips the service list when the customer already picked a service. */
  serviceId?: string;
  onBack?: () => void;
  onContinue?: (selection: ChosenPlan) => void;
};

// Booking step 2 of 5: choose a service (unless one was already picked) and one of its plans.
export default function BookingServiceScreen({ serviceId: initialServiceId, onBack, onContinue }: Props) {
  const [serviceId, setServiceId] = useState(initialServiceId);
  const [planId, setPlanId] = useState<string | undefined>();
  const [showError, setShowError] = useState(false);

  const list = useApi(async () => (serviceId ? [] : (await getServices()).map(serviceFromApi)), [serviceId]);
  const detail = useApi(async () => (serviceId ? await getService(serviceId) : null), [serviceId]);
  const service = detail.data;
  const plans = (service?.plans ?? []).map(planFromApi);

  const next = () => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan || !service) {
      setShowError(true);
      return;
    }
    onContinue?.({ serviceId: String(service.id), serviceName: service.name, plan });
  };

  const back = () => {
    // Someone who picked the service here goes back to the list first.
    if (serviceId && !initialServiceId) {
      setServiceId(undefined);
      setPlanId(undefined);
    } else onBack?.();
  };

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title="Book a Service" onBack={back} font="redhat" />
      </FadeIn>

      <FadeIn delay={150} style={styles.stepper}>
        <BookingStepper current={1} />
      </FadeIn>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!serviceId ? (
          <>
            <FadeIn delay={250} style={styles.heading}>
              <Text style={styles.title}>Choose a Service</Text>
              <Text style={styles.subtitle}>What would you like done to your vehicle?</Text>
            </FadeIn>
            <StateView loading={list.loading && !list.data} error={list.data ? undefined : list.error} onRetry={list.reload} />
            {(list.data ?? []).map((svc, i) => (
              <FadeIn key={svc.id} delay={300 + i * 70} distance={24}>
                <Pressable style={styles.serviceRow} onPress={() => setServiceId(svc.id)}>
                  <Image source={svc.image} style={styles.serviceThumb} resizeMode="cover" />
                  <View style={styles.serviceText}>
                    <Text style={styles.serviceTitle} numberOfLines={1}>
                      {svc.name}
                    </Text>
                    <Text style={styles.serviceFrom}>from ${svc.from.toFixed(2)}</Text>
                  </View>
                  <View style={styles.rating}>
                    <StarIcon />
                    <Text style={styles.ratingText}>{svc.rating.toFixed(1)}</Text>
                  </View>
                </Pressable>
              </FadeIn>
            ))}
          </>
        ) : (
          <>
            <FadeIn delay={250} style={styles.heading}>
              <Text style={styles.title}>Choose Your Package</Text>
              <Text style={styles.subtitle}>Select the level of care your vehicle needs.</Text>
            </FadeIn>
            <StateView loading={detail.loading && !service} error={service ? undefined : detail.error} onRetry={detail.reload} />

            {service && (
              <>
                <FadeIn delay={350} distance={28} style={styles.hero}>
                  <Image
                    source={service.image ? { uri: service.image } : PACKAGE_PHOTO}
                    style={styles.heroImage}
                    resizeMode="cover"
                  />
                  <View style={styles.packageInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.packageName}>{service.name}</Text>
                      <View style={styles.rating}>
                        <StarIcon />
                        <Text style={styles.ratingText}>{Number(service.rating).toFixed(1)}</Text>
                      </View>
                    </View>
                    <Text style={styles.packageDescription}>{service.description || service.summary}</Text>
                  </View>
                </FadeIn>

                <View style={styles.plans}>
                  {plans.map((plan, i) => (
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
              </>
            )}
          </>
        )}
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
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: colors.background,
  },
  serviceThumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#D9D9D9' },
  serviceText: { flex: 1, gap: 2 },
  serviceTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: colors.text },
  serviceFrom: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.textSecondary },
  error: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.red, textAlign: 'center' },
});
