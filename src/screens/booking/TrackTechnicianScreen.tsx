import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { SvgXml } from 'react-native-svg';
import FadeIn from '../../components/FadeIn';
import { BlueDotIcon, ChatIcon, HomeFilledIcon, PhoneIcon, RoutePinIcon } from '../../components/flowIcons';
import { WORKER_ICON_XML } from '../../components/workerIconXml';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import { colors } from '../../constants/theme';
import { GRAY_MAP_STYLE } from '../../constants/mapStyle';
import { BookingSummary } from '../../types/booking';
import { reverseGeocode } from '../../utils/geocoding';
import { demoRouteTo, pathLength, positionAlong } from '../../utils/route';

// --- Simulation settings (no live tracking on the backend yet) ---
const TICK_MS = 250;
const SIM_SPEED = 120; // metres per second of simulated driving, so the demo finishes in ~25s
const ETA_SPEED = 8.33; // metres per second (30 km/h) used to turn the remaining distance into minutes

// Sample technician shown in the design.
const TECHNICIAN = { name: 'Alex Wilson', id: '0145425' };

type Props = {
  summary: BookingSummary;
  onBack?: () => void;
  onReview?: () => void;
  onCall?: () => void;
  onMessage?: () => void;
};

export default function TrackTechnicianScreen({ summary, onBack, onReview, onCall, onMessage }: Props) {
  const mapRef = useRef<MapView>(null);
  const home = useMemo(() => ({ latitude: summary.latitude, longitude: summary.longitude }), [summary]);
  const route = useMemo(() => demoRouteTo(home), [home]);
  const total = useMemo(() => pathLength(route), [route]);

  const [traveled, setTraveled] = useState(0);
  const [startLabel, setStartLabel] = useState('On the way');
  // Custom markers are bitmaps; let them draw once, then stop re-rendering them for performance.
  const [trackViews, setTrackViews] = useState(true);

  const arrived = traveled >= total;
  const here = useMemo(() => positionAlong(route, traveled), [route, traveled]);
  const minutes = Math.max(1, Math.ceil((total - traveled) / ETA_SPEED / 60));

  useEffect(() => {
    const id = setInterval(() => setTraveled((t) => Math.min(total, t + (SIM_SPEED * TICK_MS) / 1000)), TICK_MS);
    return () => clearInterval(id);
  }, [total]);

  useEffect(() => {
    const id = setTimeout(() => setTrackViews(false), 800);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    reverseGeocode(route[0]).then((label) => {
      if (!cancelled && label) setStartLabel(label);
    });
    return () => {
      cancelled = true;
    };
  }, [route]);

  const fitRoute = () =>
    mapRef.current?.fitToCoordinates(route, {
      edgePadding: { top: 150, bottom: 470, left: 60, right: 60 },
      animated: false,
    });

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{ ...home, latitudeDelta: 0.03, longitudeDelta: 0.03 }}
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
        <Polyline
          coordinates={here.remaining}
          strokeColor={colors.blue}
          strokeWidth={3}
          lineDashPattern={[8, 6]}
          lineCap="round"
        />

        <Marker coordinate={home} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={trackViews} zIndex={2}>
          <View style={styles.homeMarker}>
            <HomeFilledIcon />
          </View>
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

        <Marker
          coordinate={here.coords}
          anchor={{ x: 0.5, y: 0.5 }}
          centerOffset={{ x: 0, y: -40 }}
          tracksViewChanges={trackViews}
          zIndex={4}
        >
          <Image source={require('../../../assets/images/track/tech-avatar.png')} style={styles.avatarMarker} />
        </Marker>
      </MapView>

      <LinearGradient
        pointerEvents="none"
        colors={['rgba(17,24,39,0.8)', 'rgba(17,24,39,0)']}
        style={styles.topFade}
      />

      <View style={styles.header} pointerEvents="box-none">
        <ScreenHeader title="Track Technician" onBack={onBack} font="redhat" />
      </View>

      <View style={styles.sheet} pointerEvents="box-none">
        <FadeIn delay={300} distance={40}>
          <View style={styles.card}>
            <View style={styles.statusRow}>
              <View style={styles.workerBadge}>
                <SvgXml xml={WORKER_ICON_XML} width={32} height={32} />
              </View>
              <View>
                <Text style={styles.statusTitle}>{arrived ? 'Technician has arrived' : 'Technician on the way'}</Text>
                <Text style={styles.statusSub}>
                  {arrived ? 'Your technician is at your location' : `Arriving within ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`}
                </Text>
              </View>
            </View>
          </View>
        </FadeIn>

        <FadeIn delay={420} distance={40}>
          <View style={[styles.card, styles.detailCard]}>
            <View>
              <View style={styles.stop}>
                <BlueDotIcon />
                <Text style={styles.stopText} numberOfLines={1}>
                  {startLabel}
                </Text>
              </View>
              <View style={styles.connector} />
              <View style={styles.stop}>
                <RoutePinIcon />
                <Text style={styles.stopText} numberOfLines={1}>
                  {summary.address}
                </Text>
              </View>
              <View style={styles.stopMeta}>
                <Text style={styles.metaText}>Home</Text>
                <View style={styles.metaDot} />
                <Text style={styles.metaText}>{summary.time}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.techRow}>
              <View style={styles.techLeft}>
                <View style={styles.techPhoto}>
                  <Image source={require('../../../assets/images/track/alex.jpg')} style={styles.techImage} />
                </View>
                <View>
                  <Text style={styles.techName}>{TECHNICIAN.name}</Text>
                  <Text style={styles.techId}>ID:{TECHNICIAN.id}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <Pressable style={styles.callButton} onPress={onCall} accessibilityLabel="Call technician">
                  <PhoneIcon />
                </Pressable>
                <Pressable style={styles.chatButton} onPress={onMessage} accessibilityLabel="Message technician">
                  <ChatIcon />
                </Pressable>
              </View>
            </View>
          </View>
        </FadeIn>

        <FadeIn delay={540} distance={40}>
          <PrimaryButton title="Review & Confirm" onPress={onReview} />
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
  card: { borderRadius: 12, padding: 16, backgroundColor: colors.background },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  workerBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statusTitle: { fontFamily: 'Poppins_500Medium', fontSize: 16, lineHeight: 24, letterSpacing: -0.28, color: colors.text },
  statusSub: { fontFamily: 'Poppins_500Medium', fontSize: 12, lineHeight: 24, letterSpacing: -0.28, color: colors.textSecondary },
  detailCard: { gap: 16 },
  stop: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 24 },
  stopText: { flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.text },
  connector: {
    marginLeft: 11,
    height: 36,
    width: 0,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#C1C7D0',
  },
  stopMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 32 },
  metaText: { fontFamily: 'Poppins_500Medium', fontSize: 12, lineHeight: 20, color: colors.textSecondary },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.border },
  techRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  techLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  techPhoto: { width: 40, height: 40, borderRadius: 12, overflow: 'hidden' },
  // The design crops the 3:2 portrait to the face.
  techImage: { position: 'absolute', width: 74, height: 49.3, left: -26.3, top: -4.6 },
  techName: { fontFamily: 'Poppins_500Medium', fontSize: 14, lineHeight: 15, color: colors.text },
  techId: { fontFamily: 'Poppins_400Regular', fontSize: 12, lineHeight: 20, color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: 16 },
  callButton: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.green,
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
  car: { width: 22, height: 42 },
  avatarMarker: { width: 38, height: 38 },
});
