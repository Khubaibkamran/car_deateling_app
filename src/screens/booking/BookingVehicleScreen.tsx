import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BookingStepper from '../../components/BookingStepper';
import FadeIn from '../../components/FadeIn';
import { PlusIcon } from '../../components/homeIcons';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { Vehicle } from '../../types/vehicle';
import VehicleCard from '../home/VehicleCard';

type Props = {
  vehicles: Vehicle[];
  /** Pre-selected vehicle, e.g. the one just added. */
  initialVehicleId?: string;
  onBack?: () => void;
  onAddVehicle?: () => void;
  onContinue?: (vehicle: Vehicle) => void;
};

// Booking step 1 of 5: pick the vehicle to detail.
export default function BookingVehicleScreen({ vehicles, initialVehicleId, onBack, onAddVehicle, onContinue }: Props) {
  const [selectedId, setSelectedId] = useState<string | undefined>(initialVehicleId ?? vehicles[0]?.id);
  const selected = vehicles.find((v) => v.id === selectedId);

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title="Book a Service" onBack={onBack} font="redhat" />
      </FadeIn>

      <FadeIn delay={150} style={styles.stepper}>
        <BookingStepper current={0} />
      </FadeIn>

      <FadeIn delay={250} style={styles.heading}>
        <View style={styles.headingText}>
          <Text style={styles.title}>Select Vehicle</Text>
          <Text style={styles.subtitle}>Which vehicle are we detailing?</Text>
        </View>
        <Pressable style={styles.add} hitSlop={10} onPress={onAddVehicle}>
          <PlusIcon />
          <Text style={styles.addText}>Add Vehicle</Text>
        </Pressable>
      </FadeIn>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {vehicles.map((v, i) => (
          <FadeIn key={v.id} delay={350 + i * 90} distance={28}>
            <VehicleCard vehicle={v} selected={selectedId === v.id} onPress={() => setSelectedId(v.id)} />
          </FadeIn>
        ))}
      </ScrollView>

      <FadeIn delay={600} distance={40} style={styles.footer}>
        <PrimaryButton title="Continue" onPress={() => selected && onContinue?.(selected)} />
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  stepper: { marginTop: 40 },
  heading: {
    marginTop: 32,
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headingText: { gap: 4, width: 240 },
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, letterSpacing: 0.36, color: colors.white },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.textSecondary },
  add: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addText: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.primary },
  list: { flex: 1, marginTop: 16 },
  listContent: { paddingHorizontal: 24, paddingBottom: 24, gap: 24 },
  footer: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 50 },
});
