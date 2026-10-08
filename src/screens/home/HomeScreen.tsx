import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import FadeIn from '../../components/FadeIn';
import { PinIcon, PlusIcon } from '../../components/homeIcons';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import BookingCard from './BookingCard';
import PromoBanner, { BANNER_W } from './PromoBanner';
import SectionHeader from './SectionHeader';
import ServicesCatalog from './ServicesCatalog';
import { Vehicle } from '../../types/vehicle';
import VehicleCard from './VehicleCard';

const NAV_HEIGHT = 100;

const BANNERS = [
  {
    image: require('../../../assets/images/home/banner-1.jpg'),
    scrim: { opacity: 0.8, solidUntil: 0.4375, clearAt: 0.825 },
  },
  {
    image: require('../../../assets/images/home/banner-2.jpg'),
    anchorBottom: true,
    aspect: 1024 / 683,
    scrim: { opacity: 0.5, solidUntil: 0.464, clearAt: 0.99925 },
  },
  {
    image: require('../../../assets/images/home/banner-3.jpg'),
    scrim: { opacity: 0.8, solidUntil: 0.4375, clearAt: 0.825 },
  },
];

type Props = {
  vehicles: Vehicle[];
  /** The default vehicle; when given, the selection is shared with the rest of the app. */
  selectedVehicleId?: string;
  onSelectVehicle?: (id: string) => void;
  onAddVehicle?: () => void;
  onBookService?: () => void;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
  /** Unread notifications shown on the bell. */
  notifications?: number;
};

export default function HomeScreen({ vehicles, selectedVehicleId, onSelectVehicle, onAddVehicle, onBookService, onMenuPress, onNotificationsPress, notifications }: Props) {
  const [localId, setLocalId] = useState<string | undefined>(vehicles[0]?.id);
  const selectedId = selectedVehicleId ?? localId;
  const setSelectedId = (id: string) => (onSelectVehicle ? onSelectVehicle(id) : setLocalId(id));

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />

      <AppHeader onMenuPress={onMenuPress} onNotificationsPress={onNotificationsPress} notifications={notifications} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: NAV_HEIGHT + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn delay={200} style={styles.locationRow}>
          <View style={styles.location}>
            <PinIcon size={20} />
            <Text style={styles.locationText} numberOfLines={1}>
              1287 N Alpine Drive, Beverly Hills, CA 90210
            </Text>
          </View>
          <Pressable hitSlop={10}>
            <Text style={styles.change}>Change</Text>
          </Pressable>
        </FadeIn>

        <FadeIn delay={320} distance={30} style={styles.bannerWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={BANNER_W + 16}
            decelerationRate="fast"
            contentContainerStyle={styles.banners}
          >
            {BANNERS.map((b, i) => (
              <PromoBanner key={i} {...b} />
            ))}
          </ScrollView>
        </FadeIn>

        <View style={styles.sections}>
          <FadeIn delay={440} style={styles.section}>
            <SectionHeader title="Upcoming Booking" actionLabel="View All" />
            <BookingCard />
          </FadeIn>

          <FadeIn delay={560} style={styles.section}>
            <SectionHeader title="Services Catalog" />
            <ServicesCatalog onSelect={() => onBookService?.()} />
          </FadeIn>

          <FadeIn delay={680} style={styles.section}>
            <SectionHeader
              title="Your Vehicles"
              action={
                <Pressable style={styles.addVehicle} hitSlop={10} onPress={onAddVehicle}>
                  <PlusIcon />
                  <Text style={styles.addVehicleText}>Add Vehicle</Text>
                </Pressable>
              }
            />
            <View style={styles.vehicles}>
              {vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} selected={selectedId === v.id} onPress={() => setSelectedId(v.id)} />
              ))}
            </View>
          </FadeIn>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  scroll: { flex: 1 },
  locationRow: {
    marginHorizontal: 24,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  location: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 12 },
  locationText: { flexShrink: 1, fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.text },
  change: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.blue },
  bannerWrap: { marginTop: 16 },
  banners: { paddingHorizontal: 24, gap: 16 },
  sections: { marginTop: 24, paddingHorizontal: 24, gap: 24 },
  section: { gap: 16 },
  addVehicle: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addVehicleText: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.primary },
  vehicles: { gap: 12 },
});
