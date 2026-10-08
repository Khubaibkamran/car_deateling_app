import { Coords } from './geocoding';

const EARTH_RADIUS = 6371000;
const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

/** Distance in metres between two nearby points (equirectangular approximation). */
export function distanceMeters(a: Coords, b: Coords): number {
  const x = toRad(b.longitude - a.longitude) * Math.cos(toRad((a.latitude + b.latitude) / 2));
  const y = toRad(b.latitude - a.latitude);
  return Math.sqrt(x * x + y * y) * EARTH_RADIUS;
}

/** Compass bearing in degrees (0 = north) from `a` to `b`. */
export function bearing(a: Coords, b: Coords): number {
  const dLon = toRad(b.longitude - a.longitude);
  const y = Math.sin(dLon) * Math.cos(toRad(b.latitude));
  const x =
    Math.cos(toRad(a.latitude)) * Math.sin(toRad(b.latitude)) -
    Math.sin(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function pathLength(points: Coords[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += distanceMeters(points[i - 1], points[i]);
  return total;
}

export type RoutePosition = {
  coords: Coords;
  heading: number;
  /** The unfinished part of the route, starting at the current position. */
  remaining: Coords[];
};

/** Where you are after travelling `meters` along `points`, and which way you're facing. */
export function positionAlong(points: Coords[], meters: number): RoutePosition {
  let left = Math.max(0, meters);
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const seg = distanceMeters(a, b);
    if (left <= seg || i === points.length - 1) {
      const t = seg === 0 ? 1 : Math.min(1, left / seg);
      const coords = {
        latitude: a.latitude + (b.latitude - a.latitude) * t,
        longitude: a.longitude + (b.longitude - a.longitude) * t,
      };
      return { coords, heading: bearing(a, b), remaining: [coords, ...points.slice(i)] };
    }
    left -= seg;
  }
  const last = points[points.length - 1];
  return { coords: last, heading: 0, remaining: [last] };
}

/**
 * A made-up street-style route that ends at `destination`, starting roughly 2.5 km away.
 * Used to simulate the technician driving in until live tracking exists on the backend.
 */
export function demoRouteTo(destination: Coords): Coords[] {
  const { latitude: lat, longitude: lng } = destination;
  return [
    { latitude: lat + 0.012, longitude: lng + 0.016 },
    { latitude: lat + 0.012, longitude: lng + 0.007 },
    { latitude: lat + 0.004, longitude: lng + 0.007 },
    { latitude: lat + 0.004, longitude: lng },
    { latitude: lat, longitude: lng },
  ];
}
