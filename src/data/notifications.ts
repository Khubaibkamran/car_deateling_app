export type NotificationType = 'booking' | 'onTheWay' | 'completed' | 'payment' | 'promo' | 'job' | 'reminder';

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  /** Shown as written, e.g. "2m ago". */
  time: string;
  /** "Today" notifications are listed first; everything else goes under "Earlier". */
  group: 'Today' | 'Earlier';
  read: boolean;
};

// Sample notifications. Replace with data from the backend (or push notifications) once it exists.
export const CUSTOMER_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'c1',
    type: 'onTheWay',
    title: 'Technician on the way',
    body: 'Alex Wilson is heading to your location and will arrive within 30 minutes.',
    time: '2m ago',
    group: 'Today',
    read: false,
  },
  {
    id: 'c2',
    type: 'booking',
    title: 'Booking confirmed',
    body: 'Your Exterior Wash & Shine is booked for Mon, July 27 at 10:00 AM.',
    time: '1h ago',
    group: 'Today',
    read: false,
  },
  {
    id: 'c3',
    type: 'payment',
    title: 'Payment received',
    body: 'We received your payment of $199.00 on Visa •••• 4242.',
    time: '1h ago',
    group: 'Today',
    read: false,
  },
  {
    id: 'c4',
    type: 'promo',
    title: '30% off VIP Car Care',
    body: 'Premium detailing for the car that deserves the best. Limited time offer.',
    time: 'Yesterday',
    group: 'Earlier',
    read: false,
  },
  {
    id: 'c5',
    type: 'completed',
    title: 'Service completed',
    body: 'Your Interior Deep Clean is done. Tell us how it went and rate your technician.',
    time: '3 days ago',
    group: 'Earlier',
    read: true,
  },
];

export const TECHNICIAN_NOTIFICATIONS: AppNotification[] = [
  {
    id: 't1',
    type: 'job',
    title: 'New job assigned',
    body: 'Denting & Polishing (Premium) for a BMW M4 at 1287 N Alpine Dr.',
    time: '5m ago',
    group: 'Today',
    read: false,
  },
  {
    id: 't2',
    type: 'reminder',
    title: 'Job starts tomorrow',
    body: 'You have a job tomorrow at 10:00 AM with Michael Smith.',
    time: '2h ago',
    group: 'Today',
    read: false,
  },
  {
    id: 't3',
    type: 'payment',
    title: 'Payout sent',
    body: 'Your earnings of $199.00 are on their way to your wallet.',
    time: '4h ago',
    group: 'Today',
    read: false,
  },
  {
    id: 't4',
    type: 'completed',
    title: 'New 5-star review',
    body: 'Luke Dunphy rated your work 5 stars. Great job!',
    time: 'Yesterday',
    group: 'Earlier',
    read: false,
  },
  {
    id: 't5',
    type: 'reminder',
    title: 'Update your availability',
    body: 'Switch on “Available for Jobs” to keep receiving new bookings.',
    time: '2 days ago',
    group: 'Earlier',
    read: true,
  },
];
