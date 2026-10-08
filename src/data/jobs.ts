import { ImageSourcePropType } from 'react-native';

/** `available` jobs are paid bookings nobody has taken yet. */
export type JobStatus = 'upcoming' | 'inProgress' | 'completed' | 'available';

export type Job = {
  id: string;
  /** The customer's id, when the server sent one. */
  customerId?: number;
  status: JobStatus;
  title: string;
  tier: string;
  vehicle: string;
  plate: string;
  address: string;
  /** Human-readable day, e.g. "Tomorrow". */
  when: string;
  time: string;
  customer: string;
  image: ImageSourcePropType;
};

export type TechnicianStats = {
  earningsToday: number;
  assigned: number;
  inProgress: number;
  completed: number;
};
