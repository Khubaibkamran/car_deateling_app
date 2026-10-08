import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import FadeIn from '../../components/FadeIn';
import { HomeFilledIcon } from '../../components/flowIcons';
import { ChatBubbleIcon } from '../../components/jobIcons';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import { GRAY_MAP_STYLE } from '../../constants/mapStyle';
import { colors } from '../../constants/theme';
import { JobDetail } from '../../data/jobDetails';
import { demoRouteTo, pathLength, positionAlong } from '../../utils/route';

// Simulated drive (no live technician position on the backend yet).
const TICK_MS = 250;
const SIM_SPEED = 80; // metres per second of simulated driving

type Props = {
  job: JobDetail;
  onBack?: () => void;
  onArrived?: () => void;
  onMessageCustomer?: () => void;
};

// "On the way": the technician drives to the customer. Pressing "I've Arrived" starts the job.
export default function InRouteScreen({ job, onBack, onArrived, onMessageCustomer }: Props) {
  const mapRef = useRef<MapView>(null);
  const destination = useMemo(() => ({ latitude: job.latitude, longitude: job.longitude }), [job]);
  const route = useMemo(() => demoRouteTo(destination), [destination]);
  const total = useMemo(() => pathLength(route), [route]);

  const [traveled, setTraveled] = useState(0);
  const [trackViews, setTrackViews] = useState(true);
  const here = useMemo(() => positionAlong(route, traveled), [route, traveled]);

  useEffect(() => {
    const id = setInterval(() => setTraveled((t) => Math.min(total, t + (SIM_SPEED * TICK_MS) / 1000)), TICK_MS);
    return () => clearInterval(id);
  }, [total]);

  // Custom markers are bitmaps: let them draw once, then stop re-rendering them for performance.
  useEffect(() => {
    const id = setTimeout(() => setTrackViews(false), 800);
    return () => clearTimeout(id);
  }, []);

  const fitRoute = () =>
    mapRef.current?.fitToCoordinates(route, {
      edgePadding: { top: 150, bottom: 400, left: 60, right: 60 },
      animated: false,
    });

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{ ...destination, latitudeDelta: 0.03, longitudeDelta: 0.03 }}
        customMapStyle={GRAY_MAP_STYLE}
        mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
        showsCompass={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        onMapReady={fitRoute}
        onLayout={fitRoute}
      >
        <Polyline coordinates={here.remaining} strokeColor={colors.blue} strokeWidth={3} lineDashPattern={[8, 6]} lineCap="round" />

        <Marker coordinate={destination} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={trackViews} zIndex={2}>
          <View style={styles.homeMarker}>
            <HomeFilledIcon />
          </View>
        </Marker>
        <Marker
          coordinate={destination}
          anchor={{ x: 0.5, y: 0.5 }}
          centerOffset={{ x: 0, y: -40 }}
          tracksViewChanges={trackViews}
          zIndex={4}
        >
          <Image source={job.customer.photo} style={styles.customerMarker} />
        </Marker>

        <Marker
          coordinate={here.coords}
          rotation={here.heading}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={trackViews}
          zIndex={3}
        >
          <Image source={require('../../../assets/images/track/car-top.png')} style={styles.car} resizeMode="contain" />
        </Marker>
      </MapView>

      <LinearGradient pointerEvents="none" colors={['rgba(17,24,39,0.8)', 'rgba(17,24,39,0)']} style={styles.topFade} />
      <View style={styles.header} pointerEvents="box-none">
        <ScreenHeader title="On the Way" onBack={onBack} font="redhat" />
      </View>

      <View style={styles.sheet} pointerEvents="box-none">
        <FadeIn delay={300} distance={40}>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.vehicleThumb}>
                <Image source={job.vehicle.image} style={styles.vehicleImage} resizeMode="cover" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.service} numberOfLines={1}>
                  {job.service}
                </Text>
                <Text style={styles.sub} numberOfLines={1}>
                  {job.vehicle.name} · {job.vehicle.color} · {job.vehicle.plate}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Image source={job.customer.photo} style={styles.avatar} />
              <View style={styles.rowText}>
                <Text style={styles.service} numberOfLines={1}>
                  {job.customer.name}
                </Text>
                <Text style={styles.sub} numberOfLines={1}>
                  {job.address}
                </Text>
              </View>
              <Pressable style={styles.chat} onPress={onMessageCustomer} accessibilityLabel="Message customer">
                <ChatBubbleIcon color={colors.blue} />
              </Pressable>
            </View>
          </View>
        </FadeIn>

        <FadeIn delay={450} distance={40}>
          <PrimaryButton title="I’ve Arrived" onPress={onArrived} />
        </FadeIn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D9D9D9' },
  topFade: { position: 'absolute', top: 0, left: 0, right: 0, height: 200 },
  header: { position: 'absolute', top: 0, left: 0, right: 0 },
  sheet: { position: 'absolute', left: 24, right: 24, bottom: 40, gap: 16 },
  card: { borderRadius: 12, padding: 16, backgroundColor: colors.white, gap: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowText: { flex: 1, gap: 2 },
  service: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.background },
  sub: { fontFamily: 'Poppins_400Regular', fontSize: 11, color: '#6B7280' },
  vehicleThumb: { width: 47, height: 40, borderRadius: 8, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  vehicleImage: { width: '100%', height: '100%' },
  divider: { height: 1, backgroundColor: '#E5E7EB' },
  avatar: { width: 40, height: 40, borderRadius: 10 },
  chat: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerMarker: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: colors.white },
  car: { width: 22, height: 42 },
});
