import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import Logo from '../../components/Logo';
import PrimaryButton from '../../components/PrimaryButton';
import RoleCard from '../../components/RoleCard';
import TireBackground from '../../components/TireBackground';
import Wordmark from '../../components/Wordmark';
import { colors } from '../../constants/theme';

export type Role = 'customer' | 'technician';

const native = { useNativeDriver: true } as const;

type Props = { onContinue?: (role: Role) => void };

function reveal(value: Animated.Value, delay: number) {
  return Animated.timing(value, { toValue: 1, duration: 600, delay, easing: Easing.out(Easing.cubic), ...native });
}

export default function SelectRoleScreen({ onContinue }: Props) {
  const { width } = useWindowDimensions();
  const [role, setRole] = useState<Role>('customer');

  const header = useRef(new Animated.Value(0)).current;
  const heading = useRef(new Animated.Value(0)).current;
  const card1 = useRef(new Animated.Value(0)).current;
  const card2 = useRef(new Animated.Value(0)).current;
  const cta = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      reveal(header, 100),
      reveal(heading, 250),
      reveal(card1, 450),
      reveal(card2, 620),
      reveal(cta, 800),
    ]).start();
  }, [header, heading, card1, card2, cta]);

  const rise = (v: Animated.Value, distance: number) => ({
    opacity: v,
    transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }],
  });

  return (
    <View style={styles.container}>
      <TireBackground />

      <Animated.View style={[styles.header, { left: width * 0.2 + 59.65 }, rise(header, -16)]}>
        <Logo width={35.155} />
        <Wordmark width={width * (1 - 0.4553 - 0.3377)} />
      </Animated.View>

      <Animated.View style={[styles.heading, rise(heading, 20)]}>
        <Animated.Text style={styles.title}>How will you use app?</Animated.Text>
        <Animated.Text style={styles.subtitle}>Choose your role to get started with right experience</Animated.Text>
      </Animated.View>

      <View style={styles.cards}>
        <Animated.View style={rise(card1, 36)}>
          <RoleCard
            image={require('../../../assets/images/role/customer.jpg')}
            grayImage={require('../../../assets/images/role/customer-gray.jpg')}
            label="I’m a Customer"
            selected={role === 'customer'}
            onPress={() => setRole('customer')}
          />
        </Animated.View>
        <Animated.View style={rise(card2, 36)}>
          <RoleCard
            image={require('../../../assets/images/role/technician.jpg')}
            grayImage={require('../../../assets/images/role/technician-gray.jpg')}
            label="I’m a Technician"
            selected={role === 'technician'}
            onPress={() => setRole('technician')}
          />
        </Animated.View>
      </View>

      <Animated.View style={[styles.cta, rise(cta, 40)]}>
        <PrimaryButton title="Continue" onPress={() => onContinue?.(role)} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  header: { position: 'absolute', top: 50, flexDirection: 'row', alignItems: 'center', gap: 10 },
  heading: { position: 'absolute', top: 131, left: 24, right: 24, gap: 8 },
  title: { fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: colors.text },
  subtitle: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.textSecondary },
  cards: { position: 'absolute', top: 227, left: 0, right: 0, alignItems: 'center', gap: 32 },
  cta: { position: 'absolute', left: 24, right: 24, bottom: 50 },
});
