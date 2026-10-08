import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Alert } from '../../components/AppAlert';
import AppHeader from '../../components/AppHeader';
import { TrashIcon } from '../../components/drawerIcons';
import FadeIn from '../../components/FadeIn';
import { PlusIcon } from '../../components/homeIcons';
import PrimaryButton from '../../components/PrimaryButton';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { Vehicle } from '../../types/vehicle';
import VehicleCard from '../home/VehicleCard';

const NAV_HEIGHT = 100;

type Props = {
  vehicles: Vehicle[];
  /** The vehicle used by default when booking. */
  defaultId?: string;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  onBook: (vehicle: Vehicle) => void;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
  notifications?: number;
};

// Every car you've saved: tap one to make it your default, or remove it.
export default function MyVehiclesScreen({
  vehicles,
  defaultId,
  onSelect,
  onRemove,
  onAdd,
  onBook,
  onMenuPress,
  onNotificationsPress,
  notifications,
}: Props) {
  const confirmRemove = (v: Vehicle) =>
    Alert.alert('Remove vehicle', `Remove ${v.name} (${v.plate}) from your vehicles?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => onRemove(v.id) },
    ]);

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <AppHeader onMenuPress={onMenuPress} onNotificationsPress={onNotificationsPress} notifications={notifications} />

      <FadeIn delay={150} style={styles.heading}>
        <View style={styles.headingText}>
          <Text style={styles.title}>My Vehicles</Text>
          <Text style={styles.subtitle}>
            {vehicles.length === 0 ? 'Add a car to start booking' : 'Tap a car to make it your default'}
          </Text>
        </View>
        <Pressable style={styles.add} hitSlop={10} onPress={onAdd}>
          <PlusIcon />
          <Text style={styles.addText}>Add Vehicle</Text>
        </Pressable>
      </FadeIn>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {vehicles.length === 0 ? (
          <FadeIn delay={250} style={styles.empty}>
            <Text style={styles.emptyTitle}>No vehicles yet</Text>
            <Text style={styles.emptyText}>Save your car once and book in a few taps.</Text>
            <View style={styles.emptyAction}>
              <PrimaryButton title="Add Vehicle" onPress={onAdd} />
            </View>
          </FadeIn>
        ) : (
          vehicles.map((v, i) => {
            const isDefault = v.id === defaultId;
            return (
              <FadeIn key={v.id} delay={250 + i * 80} distance={24}>
                <View>
                  <VehicleCard vehicle={v} selected={isDefault} onPress={() => onSelect(v.id)} />
                  <Pressable
                    style={styles.remove}
                    onPress={() => confirmRemove(v)}
                    hitSlop={8}
                    accessibilityLabel={`Remove ${v.name}`}
                  >
                    <TrashIcon />
                  </Pressable>
                  {isDefault && (
                    <View style={styles.defaultTag} pointerEvents="none">
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                  <Pressable style={styles.book} onPress={() => onBook(v)} hitSlop={8}>
                    <Text style={styles.bookText}>Book a service</Text>
                  </Pressable>
                </View>
              </FadeIn>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  heading: {
    marginTop: 32,
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headingText: { gap: 4, flexShrink: 1 },
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, letterSpacing: 0.36, color: colors.white },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.textSecondary },
  add: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  addText: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.primary },
  list: { flex: 1, marginTop: 16 },
  listContent: { paddingHorizontal: 24, paddingBottom: NAV_HEIGHT + 24, gap: 16 },
  remove: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16,20,24,0.85)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  defaultTag: {
    position: 'absolute',
    top: 10,
    right: 46,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: 'rgba(255,138,0,0.18)',
  },
  defaultText: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.primary },
  book: { position: 'absolute', right: 14, bottom: 10 },
  bookText: { fontFamily: 'Poppins_500Medium', fontSize: 11, color: colors.blue },
  empty: { alignItems: 'center', gap: 4, paddingTop: 60 },
  emptyTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: colors.text },
  emptyText: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
  emptyAction: { alignSelf: 'stretch', marginTop: 20 },
});
