import { ImageSourcePropType } from 'react-native';

export type ChecklistStep = { id: number; text: string; done: boolean };

export type JobDetail = {
  id: string;
  /** Booking status as the server reports it. */
  status: string;
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
  customer: { name: string; id: string; photo: ImageSourcePropType; phone?: string };
  payment: { method: string; status: 'Paid' | 'Pending' };
  /** What the customer bought, as shown on the Job Details screen. */
  details: string[];
  /** Steps the technician ticks off while working. */
  checklist: ChecklistStep[];
  /** Photos already uploaded to the job. */
  beforePhotos: { id: number; uri: string }[];
  afterPhotos: { id: number; uri: string }[];
  /** When the technician actually started, as an ISO time. */
  startedAt?: string;
};
