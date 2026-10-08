import { Vehicle } from './vehicle';

/** Everything the customer picked in the five booking steps. */
export type BookingSummary = {
  vehicle: Vehicle;
  packageName: string;
  planTag: string;
  price: number;
  /** `YYYY-MM-DD`, local time. */
  date: string;
  /** Slot label such as `10:00 AM`. */
  time: string;
  address: string;
  latitude: number;
  longitude: number;
};
