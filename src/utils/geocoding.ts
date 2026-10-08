import * as Location from 'expo-location';

export type Coords = { latitude: number; longitude: number };
export type Place = { coords: Coords; address: string };

const NOMINATIM = 'https://nominatim.openstreetmap.org';
// Nominatim's usage policy requires an identifying User-Agent.
const HEADERS = { 'User-Agent': 'CarDetailingApp/1.0', 'Accept-Language': 'en' };

/** "1287 N Alpine Drive, Beverly Hills, CA" from the device geocoder's result. */
function formatDeviceAddress(a: Location.LocationGeocodedAddress): string {
  const street = [a.streetNumber, a.street].filter(Boolean).join(' ') || a.name || '';
  return [street, a.city ?? a.subregion, a.region].filter(Boolean).join(', ');
}

type NominatimResult = {
  lat?: string;
  lon?: string;
  display_name?: string;
  address?: Record<string, string>;
};

function formatNominatimAddress(r: NominatimResult): string {
  const a = r.address ?? {};
  const street = [a.house_number, a.road].filter(Boolean).join(' ');
  const city = a.city ?? a.town ?? a.village ?? a.suburb ?? a.county;
  const line = [street, city, a.state].filter(Boolean).join(', ');
  return line || r.display_name || '';
}

async function nominatimReverse({ latitude, longitude }: Coords): Promise<string | null> {
  const res = await fetch(`${NOMINATIM}/reverse?format=jsonv2&addressdetails=1&lat=${latitude}&lon=${longitude}`, {
    headers: HEADERS,
  });
  if (!res.ok) return null;
  const data: NominatimResult = await res.json();
  return formatNominatimAddress(data) || null;
}

async function nominatimSearch(query: string): Promise<Place | null> {
  const res = await fetch(`${NOMINATIM}/search?format=jsonv2&addressdetails=1&limit=1&q=${encodeURIComponent(query)}`, {
    headers: HEADERS,
  });
  if (!res.ok) return null;
  const [hit]: NominatimResult[] = await res.json();
  if (!hit?.lat || !hit.lon) return null;
  return {
    coords: { latitude: parseFloat(hit.lat), longitude: parseFloat(hit.lon) },
    address: formatNominatimAddress(hit) || query,
  };
}

/** Street address for a point on the map, or null if none could be found. */
export async function reverseGeocode(coords: Coords): Promise<string | null> {
  try {
    const [first] = await Location.reverseGeocodeAsync(coords);
    const address = first ? formatDeviceAddress(first) : '';
    if (address) return address;
  } catch {
    // The device geocoder is unavailable (e.g. emulator without Play services); fall through.
  }
  try {
    return await nominatimReverse(coords);
  } catch {
    return null;
  }
}

/** Finds the first place matching a typed address, or null. */
export async function geocodeAddress(query: string): Promise<Place | null> {
  const text = query.trim();
  if (!text) return null;
  try {
    const [first] = await Location.geocodeAsync(text);
    if (first) return { coords: { latitude: first.latitude, longitude: first.longitude }, address: text };
  } catch {
    // Fall through to the web geocoder.
  }
  try {
    return await nominatimSearch(text);
  } catch {
    return null;
  }
}
