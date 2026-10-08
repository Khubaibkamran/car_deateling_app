import { Vehicle } from './vehicle';

/** Everything the customer picked in the five booking steps. */
export type BookingSummary = {
  /** Set once the booking exists on the server. */
  bookingId?: number;
  /** The server's status for the booking, e.g. `on_the_way`. */
  status?: string;
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
