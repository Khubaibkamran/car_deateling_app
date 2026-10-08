// Shapes returned by the backend (see /api/docs/). Decimals arrive as strings.
export type Role = 'customer' | 'technician';

export type ApiTechnicianProfile = {
  employee_code: string;
  specialty: string;
  experience: string;
  is_available: boolean;
  rating: string | number;
  rating_count: number;
  jobs_completed: number;
};

export type ApiUser = {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  city: string;
  bio: string;
  photo: string | null;
  role: Role;
  technician: ApiTechnicianProfile | null;
  date_joined: string;
};

export type AuthResponse = { access: string; refresh: string; user: ApiUser };

export type ApiPerson = {
  id: number;
  full_name: string;
  photo: string | null;
  phone: string;
  rating: number | null;
  employee_code: string | null;
};

export type ApiVehicle = {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plate: string;
  notes: string;
  photo: string | null;
  is_default: boolean;
};

/** A technician a customer can pick when booking. */
export type ApiTechnicianCard = {
  id: number;
  full_name: string;
  photo: string | null;
  bio: string;
  city: string;
  employee_code: string;
  specialty: string;
  experience: string;
  rating: number | null;
  rating_count: number;
  jobs_completed: number;
  /** Whether they are free at the time asked about; null when no time was given. */
  is_free: boolean | null;
};

export type ApiVehicleOptions = { makes: Record<string, string[]>; years: number[]; colors: string[] };

export type ApiPlan = {
  id: number;
  tag: string;
  price: string;
  duration: string;
  min_minutes: number;
  max_minutes: number;
  description: string;
};

export type ApiService = {
  id: number;
  name: string;
  slug: string;
  summary: string;
  category: string;
  category_label: string;
  image: string | null;
  rating: string;
  rating_count: number;
  from_price: string;
};

export type ApiServiceDetail = ApiService & { description: string; plans: ApiPlan[]; details: string[] };

export type BookingStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'assigned'
  | 'on_the_way'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type ApiPhoto = { id: number; kind: 'before' | 'after'; image: string; created_at: string };

export type ApiVehicleSnapshot = { name: string; year: number; color: string; plate: string; photo: string | null };

export type ApiBooking = {
  id: number;
  reference: string;
  status: BookingStatus;
  service: { id: number; name: string };
  plan_tag: string;
  price: string;
  duration: string;
  vehicle: ApiVehicleSnapshot;
  scheduled_at: string;
  address: string;
  latitude: string;
  longitude: string;
  notes: string;
  technician: ApiPerson | null;
  /** Who the customer asked for; they still have to accept. */
  requested_technician: ApiPerson | null;
  payment: { status: string; method: string; amount: string } | null;
  can_cancel: boolean;
  can_reschedule: boolean;
  can_review: boolean;
  review: { rating: number; comment: string; created_at: string } | null;
  before_photos: ApiPhoto[];
  after_photos: ApiPhoto[];
  created_at: string;
  paid_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
};

export type ApiTracking = {
  status: BookingStatus;
  technician_location: {
    latitude: string | number;
    longitude: string | number;
    heading: number;
    updated_at: string;
    distance_meters: number;
  } | null;
  eta_minutes: number | null;
};

export type ApiCard = {
  id: number;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
  label: string;
};

export type ApiJobListItem = {
  id: number;
  reference: string;
  status: BookingStatus;
  service: { id: number; name: string };
  plan_tag: string;
  price: string;
  duration: string;
  vehicle: ApiVehicleSnapshot;
  customer: ApiPerson;
  scheduled_at: string;
  address: string;
  latitude: string;
  longitude: string;
  thumbnail: string | null;
};

export type ApiChecklistItem = { id: number; text: string; done: boolean };

export type ApiJobDetail = ApiJobListItem & {
  notes: string;
  payment: { status: string; method: string } | null;
  service_details: string[];
  checklist: ApiChecklistItem[];
  before_photos: ApiPhoto[];
  after_photos: ApiPhoto[];
  earning: number | string | null;
  on_the_way_at: string | null;
  started_at: string | null;
  completed_at: string | null;
};

export type ApiDashboard = {
  name: string;
  is_available: boolean;
  earnings_today: number | string;
  assigned: number;
  in_progress: number;
  completed_today: number;
  upcoming_jobs: ApiJobListItem[];
};

export type ApiEarnings = {
  period: 'week' | 'month';
  total: number | string;
  jobs_done: number;
  average_per_job: number | string;
  rating: number | string;
  bars: { label: string; amount: number | string }[];
  balance: number | string;
  pending: number | string;
  payments: {
    id: number;
    title: string;
    customer: string;
    amount: number | string;
    created_at: string;
    available_at: string;
    pending: boolean;
  }[];
  withdrawals: { id: number; amount: string; method_label: string; status: string; requested_at: string }[];
};

export type ApiConversation = {
  id: number;
  kind: 'booking' | 'support';
  booking: number | null;
  other: { id: number; full_name: string; photo: string | null; role: string };
  subtitle: string;
  last_message: { text: string; created_at: string; mine: boolean } | null;
  unread: number;
  last_message_at: string | null;
};

export type ApiMessage = { id: number; text: string; created_at: string; read_at: string | null; mine: boolean };

export type ApiNotification = {
  id: number;
  type: string;
  title: string;
  body: string;
  booking_id: number | null;
  read: boolean;
  created_at: string;
  group: string;
  time_ago: string;
};
