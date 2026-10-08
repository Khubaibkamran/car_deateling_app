import { ImageSourcePropType } from 'react-native';

export type JobStatus = 'upcoming' | 'inProgress' | 'completed';

export type Job = {
  id: string;
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

// Sample technician data from the design. Replace with data from the backend once it exists.
export const TECHNICIAN_NAME = 'Michel';

export const TECHNICIAN_STATS: TechnicianStats = { earningsToday: 100, assigned: 8, inProgress: 6, completed: 2 };

const images = [
  require('../../assets/images/jobs/job1.jpg'),
  require('../../assets/images/jobs/job2.jpg'),
  require('../../assets/images/jobs/job3.jpg'),
];

const base = {
  title: 'Denting & Polishing',
  tier: 'Premium',
  vehicle: 'BMW M4',
  plate: 'ABC123',
  address: '1287 N Alpine Dr',
  when: 'Tomorrow',
  time: '10:00 AM',
  customer: 'Michael Smith',
};

// Upcoming jobs exactly as the home design lists them.
export const UPCOMING_JOBS: Job[] = [0, 1, 2, 3, 4].map((i) => ({
  ...base,
  id: `job-${i + 1}`,
  status: 'upcoming' as const,
  image: images[i < 3 ? i : 0],
}));

const titles = ['Exterior Wash & Shine', 'Interior Deep Clean', 'Ceramic Coating', 'Paint Correction', 'Premium Detail', 'Denting & Polishing'];
const cars: [string, string][] = [
  ['Toyota Corolla', 'XYZ789'],
  ['Hyundai Creta', 'LMN456'],
  ['Audi A4', 'QRS321'],
  ['Honda Civic', 'TUV654'],
  ['Ford Focus', 'GHI987'],
  ['BMW M4', 'ABC123'],
];
const people = ['Luke Dunphy', 'Sarah Johnson', 'David Lee', 'Emma Brown', 'Chris Taylor', 'Michael Smith'];
const addresses = ['410 S Beverly Dr', '9021 Wilshire Blvd', '1287 N Alpine Dr', '355 N Canon Dr', '120 S Rodeo Dr', '8500 Sunset Blvd'];

// In-progress and completed jobs are made up to fill the My Jobs tabs (the design only shows upcoming ones).
const make = (i: number, status: JobStatus, when: string, time: string): Job => ({
  id: `${status}-${i + 1}`,
  status,
  title: titles[i % titles.length],
  tier: i % 2 === 0 ? 'Premium' : 'Basic',
  vehicle: cars[i % cars.length][0],
  plate: cars[i % cars.length][1],
  address: addresses[i % addresses.length],
  when,
  time,
  customer: people[i % people.length],
  image: images[i % images.length],
});

export const IN_PROGRESS_JOBS: Job[] = Array.from({ length: 6 }, (_, i) =>
  make(i, 'inProgress', 'Today', ['8:00 AM', '9:30 AM', '11:00 AM', '1:00 PM', '2:30 PM', '4:00 PM'][i]),
);

export const COMPLETED_JOBS: Job[] = [make(3, 'completed', 'Yesterday', '3:00 PM'), make(4, 'completed', 'Yesterday', '11:30 AM')];

export const ALL_JOBS: Record<JobStatus, Job[]> = {
  upcoming: UPCOMING_JOBS,
  inProgress: IN_PROGRESS_JOBS,
  completed: COMPLETED_JOBS,
};
