import { api, filePart, getAll } from './client';
import {
  ApiBooking,
  ApiCard,
  ApiService,
  ApiServiceDetail,
  ApiTechnicianCard,
  ApiTracking,
  ApiVehicle,
  ApiVehicleOptions,
} from './types';

// ---- vehicles
export const getVehicles = () => getAll<ApiVehicle>('/vehicles/');
export const getVehicleOptions = () => api.get<ApiVehicleOptions>('/vehicles/options/').then((r) => r.data);

export type NewVehicleBody = {
  make: string;
  model: string;
  year: number;
  color: string;
  plate: string;
  notes?: string;
  photoUri?: string;
  is_default?: boolean;
};

export async function createVehicle({ photoUri, ...body }: NewVehicleBody) {
  if (photoUri) {
    const form = new FormData();
    Object.entries(body).forEach(([k, v]) => v !== undefined && form.append(k, String(v)));
    form.append('photo', filePart(photoUri, 'vehicle.jpg'));
    return api.post<ApiVehicle>('/vehicles/', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
  }
  return api.post<ApiVehicle>('/vehicles/', body).then((r) => r.data);
}
export const deleteVehicle = (id: number | string) => api.delete(`/vehicles/${id}/`);
export const makeDefaultVehicle = (id: number | string) =>
  api.post<ApiVehicle>(`/vehicles/${id}/make-default/`).then((r) => r.data);

// ---- services
export const getServices = (params?: { category?: string; q?: string }) => getAll<ApiService>('/services/', params);
export const getService = (id: number | string) => api.get<ApiServiceDetail>(`/services/${id}/`).then((r) => r.data);

// ---- technicians
/** Technicians who take jobs, best rated first. Pass the booking time to learn who is free then. */
export const getTechnicians = (scheduledAt?: string, plan?: number) =>
  getAll<ApiTechnicianCard>('/technicians/', { scheduled_at: scheduledAt, plan });

// ---- bookings
export type NewBookingBody = {
  vehicle: number;
  plan: number;
  /** ISO 8601 with a time zone. */
  scheduled_at: string;
  address: string;
  latitude: number;
  longitude: number;
  notes?: string;
  /** Book with this technician; they have to accept it. */
  technician?: number;
};

export const createBooking = (body: NewBookingBody) =>
  api
    .post<ApiBooking>('/bookings/', {
      ...body,
      // The server stores 6 decimal places.
      latitude: body.latitude.toFixed(6),
      longitude: body.longitude.toFixed(6),
    })
    .then((r) => r.data);
export const getBookings = (scope?: 'upcoming' | 'past') => getAll<ApiBooking>('/bookings/', scope ? { scope } : undefined);
export const getBooking = (id: number | string) => api.get<ApiBooking>(`/bookings/${id}/`).then((r) => r.data);
export const payBooking = (id: number | string, card?: number) =>
  api.post<ApiBooking>(`/bookings/${id}/pay/`, card ? { card } : {}).then((r) => r.data);
export const cancelBooking = (id: number | string, reason = '') =>
  api.post<ApiBooking>(`/bookings/${id}/cancel/`, { reason }).then((r) => r.data);
export const rescheduleBooking = (id: number | string, scheduled_at: string) =>
  api.post<ApiBooking>(`/bookings/${id}/reschedule/`, { scheduled_at }).then((r) => r.data);
export const reviewBooking = (id: number | string, rating: number, comment: string) =>
  api.post(`/bookings/${id}/review/`, { rating, comment }).then((r) => r.data);
export const getTracking = (id: number | string) => api.get<ApiTracking>(`/bookings/${id}/tracking/`).then((r) => r.data);

// ---- payment methods
export const getCards = () => api.get<ApiCard[]>('/cards/').then((r) => r.data);
export const addCard = (body: { brand: string; last4: string; exp_month: number; exp_year: number; is_default?: boolean }) =>
  api.post<ApiCard>('/cards/', body).then((r) => r.data);
export const deleteCard = (id: number) => api.delete(`/cards/${id}/`);
export const makeDefaultCard = (id: number) => api.post<ApiCard>(`/cards/${id}/make-default/`).then((r) => r.data);
