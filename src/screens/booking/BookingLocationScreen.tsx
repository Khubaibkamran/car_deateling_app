import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MapView, { Region } from 'react-native-maps';
import BookingLayout from '../../components/BookingLayout';
import { MapPinIcon, SearchPinIcon } from '../../components/bookingIcons';
import FadeIn from '../../components/FadeIn';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../constants/theme';
import { Coords, geocodeAddress, reverseGeocode } from '../../utils/geocoding';

// Where the map starts until we know the user's position (the address used in the design).
const DEFAULT_REGION: Region = { latitude: 34.0736, longitude: -118.4004, latitudeDelta: 0.012, longitudeDelta: 0.012 };
const MIN_DELTA = 0.0008;
const MAX_DELTA = 60;

export type BookingLocation = { address: string; latitude: number; longitude: number };

type Props = {
  onBack?: () => void;
  onContinue?: (location: BookingLocation) => void;
};

// Booking step 4 of 5: choose where the car will be detailed, on a real map.
export default function BookingLocationScreen({ onBack, onContinue }: Props) {
  const mapRef = useRef<MapView>(null);
  const region = useRef<Region>(DEFAULT_REGION);
  const lookupId = useRef(0);
  const editing = useRef(false);

  const [center, setCenter] = useState<Coords>({
    latitude: DEFAULT_REGION.latitude,
    longitude: DEFAULT_REGION.longitude,
  });
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // The pin lifts while the map is being dragged and drops when it settles.
  const lift = useRef(new Animated.Value(0)).current;
  const setLifted = useCallback(
    (up: boolean) =>
      Animated.spring(lift, { toValue: up ? 1 : 0, speed: 18, bounciness: up ? 4 : 12, useNativeDriver: true }).start(),
    [lift],
  );

  const lookUpAddress = useCallback(async (coords: Coords) => {
    const id = ++lookupId.current;
    setBusy(true);
    const found = await reverseGeocode(coords);
    if (id !== lookupId.current) return; // a newer lookup superseded this one
    setBusy(false);
    if (found) {
      if (!editing.current) setAddress(found);
      setMessage(null);
    } else if (!editing.current) {
      setAddress('');
      setMessage("We couldn't find an address here. Move the map or type one.");
    }
  }, []);

  const goTo = useCallback((coords: Coords, delta = 0.006) => {
    mapRef.current?.animateToRegion({ ...coords, latitudeDelta: delta, longitudeDelta: delta }, 600);
  }, []);

  // Start at the user's position if they've already allowed location access.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted' || cancelled) return;
      setHasPermission(true);
      const last = await Location.getLastKnownPositionAsync();
      if (last && !cancelled) goTo(last.coords);
    })().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [goTo]);

  // Look up the starting point once the map first reports where it is.
  useEffect(() => {
    lookUpAddress({ latitude: DEFAULT_REGION.latitude, longitude: DEFAULT_REGION.longitude });
  }, [lookUpAddress]);

  const onRegionChangeComplete = (r: Region) => {
    region.current = r;
    const coords = { latitude: r.latitude, longitude: r.longitude };
    setCenter(coords);
    setLifted(false);
    lookUpAddress(coords);
  };

  const useCurrentLocation = async () => {
    setMessage(null);
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setMessage('Location permission is off. Allow it in Settings, or type an address.');
        return;
      }
      setHasPermission(true);
      const here = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      editing.current = false;
      goTo(here.coords);
    } catch {
      setMessage("We couldn't get your location. Check that location services are on.");
    } finally {
      setLocating(false);
    }
  };

  const search = async () => {
    const query = address.trim();
    if (!query) return;
    editing.current = false;
    setMessage(null);
    setBusy(true);
    const place = await geocodeAddress(query);
    setBusy(false);
    if (!place) {
      setMessage("We couldn't find that address. Try adding the city.");
      return;
    }
    goTo(place.coords);
  };

  const zoom = (factor: number) => {
    const r = region.current;
    const delta = Math.min(MAX_DELTA, Math.max(MIN_DELTA, r.latitudeDelta * factor));
    mapRef.current?.animateToRegion({ ...r, latitudeDelta: delta, longitudeDelta: delta }, 250);
  };

  const next = () => {
    if (!address.trim()) {
      setMessage('Pick a spot on the map or enter an address to continue.');
      return;
    }
    onContinue?.({ address: address.trim(), latitude: center.latitude, longitude: center.longitude });
  };

  const pinStyle = {
    transform: [{ translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -12] }) }],
  };

  return (
    <BookingLayout step={3} onBack={onBack}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FadeIn delay={250} style={styles.heading}>
          <Text style={styles.title}>Select Location</Text>
          <Text style={styles.subtitle}>Choose where you&apos;d like your vehicle detailed</Text>
        </FadeIn>

        <FadeIn delay={350} style={styles.search}>
          <Text style={styles.label}>Search or enter an address</Text>
          <View style={styles.field}>
            <TextInput
              value={address}
              onChangeText={(t) => {
                editing.current = true;
                setAddress(t);
              }}
              onFocus={() => {
                editing.current = true;
              }}
              onBlur={() => {
                editing.current = false;
              }}
              onSubmitEditing={search}
              returnKeyType="search"
              placeholder="Enter your address"
              placeholderTextColor={colors.textSecondary}
              selectionColor={colors.primary}
              style={styles.input}
              autoCorrect={false}
            />
            {busy ? (
              <ActivityIndicator color={colors.blue} />
            ) : (
              <Pressable onPress={search} hitSlop={12} accessibilityLabel="Search address">
                <SearchPinIcon />
              </Pressable>
            )}
          </View>
          <Pressable onPress={useCurrentLocation} hitSlop={10} disabled={locating}>
            <Text style={styles.useCurrent}>{locating ? 'Finding your location…' : 'Use current location'}</Text>
          </Pressable>
          {message && <Text style={styles.message}>{message}</Text>}
        </FadeIn>

        <FadeIn delay={500} distance={30} style={styles.mapWrap}>
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            initialRegion={DEFAULT_REGION}
            showsUserLocation={hasPermission}
            showsMyLocationButton={false}
            showsCompass={false}
            toolbarEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            onPanDrag={() => setLifted(true)}
            onRegionChangeComplete={onRegionChangeComplete}
          />

          {/* Fixed pin: the map moves underneath it, and the point under the dot is the chosen spot. */}
          <View pointerEvents="none" style={styles.pinLayer}>
            <View style={styles.dotShadow} />
            <View style={styles.dotOuter}>
              <View style={styles.dotInner} />
            </View>
            <Animated.View style={[styles.pin, pinStyle]}>
              <MapPinIcon />
            </Animated.View>
          </View>

          <View style={styles.zoom}>
            <Pressable style={styles.zoomButton} onPress={() => zoom(0.5)} hitSlop={6} accessibilityLabel="Zoom in">
              <Text style={styles.zoomText}>+</Text>
            </Pressable>
            <View style={styles.zoomDivider} />
            <Pressable style={styles.zoomButton} onPress={() => zoom(2)} hitSlop={6} accessibilityLabel="Zoom out">
              <Text style={styles.zoomText}>−</Text>
            </Pressable>
          </View>
        </FadeIn>

        <FadeIn delay={750} distance={40} style={styles.footer}>
          <PrimaryButton title="Continue" onPress={next} />
        </FadeIn>
      </KeyboardAvoidingView>
    </BookingLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  heading: { marginTop: 32, marginHorizontal: 24, gap: 4 },
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, letterSpacing: 0.36, color: colors.white },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.textSecondary },
  search: { marginTop: 21, marginHorizontal: 24, gap: 8 },
  label: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.white },
  field: {
    height: 56,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    paddingLeft: 19,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: { flex: 1, height: '100%', padding: 0, fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.text },
  useCurrent: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.primary },
  message: { fontFamily: 'Poppins_400Regular', fontSize: 12, lineHeight: 17, color: colors.red },
  mapWrap: {
    flex: 1,
    minHeight: 180,
    marginTop: 24,
    marginHorizontal: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#D9D9D9',
  },
  pinLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  dotShadow: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  dotOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.background },
  // The tip of the pin icon (22px tall) lands on the dot's centre.
  pin: { position: 'absolute', marginBottom: 22 },
  zoom: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 28,
    borderRadius: 6,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  zoomButton: { height: 32, alignItems: 'center', justifyContent: 'center' },
  zoomText: { fontFamily: 'Poppins_500Medium', fontSize: 18, lineHeight: 22, color: colors.text },
  zoomDivider: { height: 2, backgroundColor: colors.border },
  footer: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 50 },
});
