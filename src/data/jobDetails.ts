import { ImageSourcePropType } from 'react-native';

export type JobDetail = {
  service: string;
  plan: string;
  price: number;
  /** Shown as written, e.g. "Mon, July 27". */
  date: string;
  time: string;
  vehicle: {
    name: string;
    year: string;
    color: string;
    plate: string;
    image: ImageSourcePropType;
  };
  address: string;
  latitude: number;
  longitude: number;
  customer: { name: string; id: string; photo: ImageSourcePropType };
  payment: { method: string; status: 'Paid' | 'Pending' };
  /** What the customer bought, as shown on the Job Details screen. */
  details: string[];
  /** Steps the technician ticks off while working. */
  checklist: string[];
};

// Sample job from the design. Replace with the job fetched from the backend once it exists.
export const SAMPLE_JOB_DETAIL: JobDetail = {
  service: 'Exterior Wash & Shine',
  plan: 'Premium Plan',
  price: 199,
  date: 'Mon, July 27',
  time: '10:00 AM',
  vehicle: {
    name: 'Toyota Corolla',
    year: '2016',
    color: 'Green',
    plate: 'ABC1234',
    image: require('../../assets/images/home/vehicle-creta.png'),
  },
  address: '1287 N Alpine Drive, Beverly Hills, CA',
  latitude: 34.0736,
  longitude: -118.4004,
  customer: {
    name: 'Luke Dunphy',
    id: '123456',
    photo: require('../../assets/images/home/avatar.jpg'),
  },
  payment: { method: 'Visa •••• 4242', status: 'Paid' },
  details: [
    'Deep interior & exterior detailing',
    'Interior vacuuming & deep cleaning',
    'Exterior wash & hand polish',
    'Tire cleaning & shine',
    'Estimated duration: 2–3 hours',
  ],
  checklist: [
    'Inspect vehicle and document existing condition',
    'Vacuum seats, mats, and floors',
    'Clean all windows and mirrors',
    'Wash vehicle exterior and wheels',
    'Apply finishing touches and tire shine',
    'Perform final inspection and upload photos',
  ],
};
