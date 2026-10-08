import { ImageSourcePropType } from 'react-native';

export type ChatMessage = {
  id: string;
  from: 'me' | 'them';
  text: string;
  /** Shown as written, e.g. "10:42 AM". */
  time: string;
};

export type Conversation = {
  id: string;
  name: string;
  /** Customer photo; falls back to the initial when missing. */
  photo?: ImageSourcePropType;
  subtitle: string;
  unread: number;
  messages: ChatMessage[];
};

// Sample conversations. Replace with data from the backend (and a realtime channel) once it exists.
export const CONVERSATIONS: Conversation[] = [
  {
    id: 'luke',
    name: 'Luke Dunphy',
    photo: require('../../assets/images/home/avatar.jpg'),
    subtitle: 'Exterior Wash & Shine',
    unread: 2,
    messages: [
      { id: '1', from: 'them', text: 'Hi! Are you still able to come at 10:00 AM?', time: '9:41 AM' },
      { id: '2', from: 'me', text: 'Yes, I’m on my way. I’ll be there in about 20 minutes.', time: '9:43 AM' },
      { id: '3', from: 'them', text: 'Great. The gate code is 4521.', time: '9:44 AM' },
      { id: '4', from: 'them', text: 'The car is parked on the driveway.', time: '9:44 AM' },
    ],
  },
  {
    id: 'michael',
    name: 'Michael Smith',
    subtitle: 'Denting & Polishing',
    unread: 0,
    messages: [
      { id: '1', from: 'me', text: 'Hello Michael, I’ll be handling your BMW tomorrow at 10:00 AM.', time: 'Yesterday' },
      { id: '2', from: 'them', text: 'Perfect, thank you!', time: 'Yesterday' },
    ],
  },
  {
    id: 'sarah',
    name: 'Sarah Johnson',
    subtitle: 'Interior Deep Clean',
    unread: 1,
    messages: [{ id: '1', from: 'them', text: 'Can you also clean the trunk please?', time: 'Mon' }],
  },
  {
    id: 'david',
    name: 'David Lee',
    subtitle: 'Ceramic Coating',
    unread: 0,
    messages: [
      { id: '1', from: 'them', text: 'The car looks amazing, thank you!', time: 'Sun' },
      { id: '2', from: 'me', text: 'Glad you like it. Enjoy!', time: 'Sun' },
    ],
  },
];

// Sample chats for the customer app: the technician on a booking, plus support.
export const CUSTOMER_CONVERSATIONS: Conversation[] = [
  {
    id: 'alex',
    name: 'Alex Wilson',
    photo: require('../../assets/images/track/alex.jpg'),
    subtitle: 'Your technician · Exterior Wash & Shine',
    unread: 1,
    messages: [
      { id: '1', from: 'me', text: 'Hi Alex, the car is on the driveway. Gate code is 4521.', time: '9:44 AM' },
      { id: '2', from: 'them', text: 'Thanks! I’m about 15 minutes away.', time: '9:46 AM' },
      { id: '3', from: 'them', text: 'I’ll message you as soon as I arrive.', time: '9:46 AM' },
    ],
  },
  {
    id: 'support',
    name: 'Volvo Support',
    subtitle: 'We usually reply within an hour',
    unread: 0,
    messages: [
      { id: '1', from: 'me', text: 'Can I change the time of my booking?', time: 'Mon' },
      { id: '2', from: 'them', text: 'Of course! You can reschedule up to 2 hours before your slot from My Bookings.', time: 'Mon' },
    ],
  },
  {
    id: 'mark',
    name: 'Mark Taylor',
    subtitle: 'Previous technician · Interior Deep Clean',
    unread: 0,
    messages: [{ id: '1', from: 'them', text: 'Thanks for choosing us, hope you loved the result!', time: 'Last week' }],
  },
];
