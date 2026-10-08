import { ImageSourcePropType } from 'react-native';
import { AppNotification, NotificationType } from '../data/notifications';
import { ChatMessage, Conversation } from '../data/messages';
import { JobDetail } from '../data/jobDetails';
import { Job, JobStatus } from '../data/jobs';
import { Plan } from '../data/packages';
import { ServiceItem } from '../data/services';
import { BookingSummary } from '../types/booking';
import { UserProfile } from '../types/profile';
import { Vehicle } from '../types/vehicle';
import {
  ApiBooking,
  ApiConversation,
  ApiJobDetail,
  ApiJobListItem,
  ApiMessage,
  ApiNotification,
  ApiPlan,
  ApiService,
  ApiUser,
  ApiVehicle,
  BookingStatus,
} from './types';

const JOB_PHOTOS: ImageSourcePropType[] = [
  require('../../assets/images/jobs/job1.jpg'),
  require('../../assets/images/jobs/job2.jpg'),
  require('../../assets/images/jobs/job3.jpg'),
];
const SERVICE_PHOTOS: ImageSourcePropType[] = [
  require('../../assets/images/services/s1.jpg'),
  require('../../assets/images/services/s2.jpg'),
  require('../../assets/images/services/s3.jpg'),
  require('../../assets/images/services/s4.jpg'),
  require('../../assets/images/services/s5.jpg'),
];
export const PACKAGE_PHOTO: ImageSourcePropType = require('../../assets/images/booking/package.jpg');
export const AVATAR_PHOTO: ImageSourcePropType = require('../../assets/images/home/avatar.jpg');
const CAR_PHOTO: ImageSourcePropType = require('../../assets/images/home/vehicle-creta.png');

// Where a customer's own vehicle photo sits on a vehicle card (the whole left side).
const USER_PHOTO_BOX = { left: 1, top: 1, width: 178, height: 96 };

const num = (v: string | number | null | undefined) => (v === null || v === undefined ? 0 : Number(v));
const uri = (url: string | null | undefined): ImageSourcePropType | undefined => (url ? { uri: url } : undefined);

// ---------------------------------------------------------------- dates

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** "10:00 AM" in the phone's time zone. */
export function timeLabel(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours() % 12 || 12;
  return `${h}:${`${d.getMinutes()}`.padStart(2, '0')} ${d.getHours() < 12 ? 'AM' : 'PM'}`;
}

/** "Mon, July 27" in the phone's time zone. */
export function longDateLabel(iso: string): string {
  const d = new Date(iso);
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** `YYYY-MM-DD` in the phone's time zone. */
export function dateKeyOf(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(2, '0')}`;
}

/** "Today", "Tomorrow", "Yesterday", otherwise "Mon, Jul 27". */
export function dayLabel(iso: string): string {
  const diff = Math.round((startOfDay(new Date(iso)) - startOfDay(new Date())) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  const d = new Date(iso);
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}

/** Chat and payment timestamps: time today, otherwise the day. */
export function stampLabel(iso: string): string {
  const day = dayLabel(iso);
  return day === 'Today' ? timeLabel(iso) : `${day}, ${timeLabel(iso)}`;
}

/** Combines a `YYYY-MM-DD` day and a slot label such as "02:00 PM" into an ISO time (UTC). */
export function scheduleToIso(date: string, slot: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const [clock, meridiem] = slot.split(' ');
  let [hour, minute] = clock.split(':').map(Number);
  if (meridiem === 'PM' && hour < 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  return new Date(y, m - 1, d, hour, minute).toISOString();
}

// ---------------------------------------------------------------- profile

export function profileFromUser(u: ApiUser): UserProfile {
  return {
    id: u.id,
    name: u.full_name,
    email: u.email,
    phone: u.phone ?? '',
    city: u.city ?? '',
    specialty: u.technician?.specialty ?? '',
    experience: u.technician?.experience ?? '',
    bio: u.bio ?? '',
    photo: u.photo ?? undefined,
    employeeCode: u.technician?.employee_code,
    rating: u.technician ? Number(u.technician.rating) : undefined,
    ratingCount: u.technician?.rating_count,
    jobsCompleted: u.technician?.jobs_completed,
  };
}

// ---------------------------------------------------------------- vehicles

export function vehicleFromApi(v: ApiVehicle): Vehicle {
  return {
    id: String(v.id),
    name: v.name,
    year: String(v.year),
    color: v.color,
    plate: v.plate,
    notes: v.notes,
    image: uri(v.photo),
    imageBox: v.photo ? USER_PHOTO_BOX : undefined,
  };
}

// ---------------------------------------------------------------- services

export function serviceFromApi(s: ApiService, index = 0): ServiceItem {
  return {
    id: String(s.id),
    name: s.name,
    description: s.summary,
    from: num(s.from_price),
    rating: num(s.rating),
    category: s.category_label as ServiceItem['category'],
    image: uri(s.image) ?? SERVICE_PHOTOS[index % SERVICE_PHOTOS.length],
  };
}

export function planFromApi(p: ApiPlan): Plan {
  return { id: String(p.id), tag: p.tag, price: num(p.price), duration: p.duration, description: p.description };
}

// ---------------------------------------------------------------- bookings

/** Short tier name from a plan tag: "Premium Plan" -> "Premium". */
export const tierOf = (planTag: string) => planTag.replace(/\s*plan$/i, '');

export function summaryFromBooking(b: ApiBooking, vehicle?: Vehicle): BookingSummary {
  return {
    bookingId: b.id,
    status: b.status,
    vehicle: vehicle ?? {
      id: b.reference,
      name: b.vehicle.name,
      year: String(b.vehicle.year),
      color: b.vehicle.color,
      plate: b.vehicle.plate,
      image: uri(b.vehicle.photo),
      imageBox: b.vehicle.photo ? USER_PHOTO_BOX : undefined,
    },
    packageName: b.service.name,
    planTag: b.plan_tag,
    price: num(b.price),
    date: dateKeyOf(b.scheduled_at),
    time: timeLabel(b.scheduled_at),
    address: b.address,
    latitude: num(b.latitude),
    longitude: num(b.longitude),
  };
}

export const ACTIVE_BOOKING: BookingStatus[] = ['pending_payment', 'confirmed', 'assigned', 'on_the_way', 'in_progress'];

/** What the customer is told about each stage of a booking. */
export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending_payment: 'Payment pending',
  confirmed: 'Pending',
  assigned: 'Accepted',
  on_the_way: 'On the way',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const STATUS_NOTE: Record<BookingStatus, string> = {
  pending_payment: 'Complete the payment to confirm your booking',
  confirmed: 'Waiting for a technician to accept',
  assigned: 'A technician accepted your booking',
  on_the_way: 'Your technician is heading to you',
  in_progress: 'Your vehicle is being serviced',
  completed: 'Your service is done',
  cancelled: 'This booking was cancelled',
};

/** How far along a booking is, as the number of the 4 steps reached (Pending, Accepted, On the way, In progress). */
export const STATUS_STEP: Record<BookingStatus, number> = {
  pending_payment: 0,
  confirmed: 1,
  assigned: 2,
  on_the_way: 3,
  in_progress: 4,
  completed: 4,
  cancelled: 0,
};

// ---------------------------------------------------------------- technician jobs

const JOB_GROUP: Record<BookingStatus, JobStatus> = {
  pending_payment: 'upcoming',
  confirmed: 'upcoming',
  assigned: 'upcoming',
  on_the_way: 'inProgress',
  in_progress: 'inProgress',
  completed: 'completed',
  cancelled: 'completed',
};

export function jobFromApi(j: ApiJobListItem, index = 0): Job {
  return {
    id: String(j.id),
    customerId: j.customer?.id,
    status: JOB_GROUP[j.status],
    title: j.service.name,
    tier: tierOf(j.plan_tag),
    vehicle: j.vehicle.name,
    plate: j.vehicle.plate,
    address: j.address,
    when: dayLabel(j.scheduled_at),
    time: timeLabel(j.scheduled_at),
    customer: j.customer?.full_name ?? '',
    // The customer's own car photo when they added one, otherwise the service picture.
    image: uri(j.vehicle.photo) ?? uri(j.thumbnail) ?? JOB_PHOTOS[index % JOB_PHOTOS.length],
  };
}

export function jobDetailFromApi(j: ApiJobDetail): JobDetail {
  const paid = j.payment?.status === 'paid';
  return {
    id: String(j.id),
    status: j.status,
    service: j.service.name,
    plan: j.plan_tag,
    price: num(j.price),
    date: longDateLabel(j.scheduled_at),
    time: timeLabel(j.scheduled_at),
    vehicle: {
      name: j.vehicle.name,
      year: String(j.vehicle.year),
      color: j.vehicle.color,
      plate: j.vehicle.plate,
      image: uri(j.vehicle.photo) ?? CAR_PHOTO,
    },
    address: j.address,
    latitude: num(j.latitude),
    longitude: num(j.longitude),
    customer: {
      name: j.customer?.full_name ?? '',
      id: String(j.customer?.id ?? ''),
      photo: uri(j.customer?.photo) ?? AVATAR_PHOTO,
      phone: j.customer?.phone || undefined,
    },
    payment: { method: j.payment?.method ?? '—', status: paid ? 'Paid' : 'Pending' },
    details: j.service_details,
    checklist: j.checklist.map((c) => ({ id: c.id, text: c.text, done: c.done })),
    beforePhotos: j.before_photos.map((p) => ({ id: p.id, uri: p.image })),
    afterPhotos: j.after_photos.map((p) => ({ id: p.id, uri: p.image })),
    startedAt: j.started_at ?? undefined,
  };
}

// ---------------------------------------------------------------- notifications & chat

const NOTIFICATION_TYPES: NotificationType[] = ['booking', 'onTheWay', 'completed', 'payment', 'promo', 'job', 'reminder'];

export function notificationFromApi(n: ApiNotification): AppNotification {
  return {
    id: String(n.id),
    type: NOTIFICATION_TYPES.includes(n.type as NotificationType) ? (n.type as NotificationType) : 'booking',
    title: n.title,
    body: n.body,
    time: n.time_ago,
    group: n.group === 'Today' ? 'Today' : 'Earlier',
    read: n.read,
    bookingId: n.booking_id ?? undefined,
  };
}

export function messageFromApi(m: ApiMessage): ChatMessage {
  return { id: String(m.id), from: m.mine ? 'me' : 'them', text: m.text, time: stampLabel(m.created_at) };
}

export function conversationFromApi(c: ApiConversation, messages: ChatMessage[] = []): Conversation {
  return {
    id: String(c.id),
    name: c.other.full_name,
    photo: uri(c.other.photo),
    subtitle: c.subtitle,
    unread: c.unread,
    messages,
  };
}
