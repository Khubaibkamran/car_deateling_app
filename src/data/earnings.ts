export type Period = 'week' | 'month';

export type Bar = { label: string; amount: number };

export type Payment = {
  id: string;
  title: string;
  customer: string;
  date: string;
  amount: number;
  /** Money that hasn't reached the wallet yet. */
  pending?: boolean;
};

// Sample earnings. Replace with data from the backend once it exists.
export const OPENING_BALANCE = 486;

export const BARS: Record<Period, Bar[]> = {
  week: [
    { label: 'Mon', amount: 40 },
    { label: 'Tue', amount: 85 },
    { label: 'Wed', amount: 120 },
    { label: 'Thu', amount: 60 },
    { label: 'Fri', amount: 0 },
    { label: 'Sat', amount: 199 },
    { label: 'Sun', amount: 100 },
  ],
  month: [
    { label: 'W1', amount: 410 },
    { label: 'W2', amount: 520 },
    { label: 'W3', amount: 380 },
    { label: 'W4', amount: 604 },
  ],
};

export const JOBS_DONE: Record<Period, number> = { week: 12, month: 41 };

export const PAYMENTS: Payment[] = [
  { id: 'p1', title: 'Exterior Wash & Shine', customer: 'Luke Dunphy', date: 'Today, 10:45 AM', amount: 199, pending: true },
  { id: 'p2', title: 'Denting & Polishing', customer: 'Michael Smith', date: 'Yesterday, 3:20 PM', amount: 129 },
  { id: 'p3', title: 'Interior Deep Clean', customer: 'Sarah Johnson', date: 'Yesterday, 12:05 PM', amount: 79 },
  { id: 'p4', title: 'Ceramic Coating', customer: 'David Lee', date: 'Mon, Oct 5', amount: 249 },
  { id: 'p5', title: 'Paint Correction', customer: 'Emma Brown', date: 'Sun, Oct 4', amount: 159 },
];
