import { api, filePart, getAll } from './client';
import { ApiChecklistItem, ApiDashboard, ApiEarnings, ApiJobDetail, ApiJobListItem, ApiPhoto } from './types';

export type JobGroup = 'upcoming' | 'in_progress' | 'completed';

/** The device's IANA time zone, so "today" and the weekday bars match the phone's clock. */
const tz = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getDashboard = () => api.get<ApiDashboard>('/technician/dashboard/', { params: { tz: tz() } }).then((r) => r.data);
export const getEarnings = (period: 'week' | 'month') =>
  api.get<ApiEarnings>('/technician/earnings/', { params: { period, tz: tz() } }).then((r) => r.data);
export const withdraw = (method_label = '') => api.post('/technician/wallet/withdraw/', { method_label }).then((r) => r.data);

export const getJobs = (status?: JobGroup) => getAll<ApiJobListItem>('/technician/jobs/', status ? { status } : undefined);
export const getJob = (id: number | string) => api.get<ApiJobDetail>(`/technician/jobs/${id}/`).then((r) => r.data);
export const getOpenJobs = () => getAll<ApiJobListItem>('/technician/open-jobs/');
export const acceptJob = (id: number | string) =>
  api.post<ApiJobDetail>(`/technician/open-jobs/${id}/accept/`).then((r) => r.data);

export const startRoute = (id: number | string) => api.post<ApiJobDetail>(`/technician/jobs/${id}/start-route/`).then((r) => r.data);
export const markArrived = (id: number | string) => api.post<ApiJobDetail>(`/technician/jobs/${id}/arrived/`).then((r) => r.data);
export const setChecklistItem = (jobId: number | string, itemId: number, done: boolean) =>
  api.patch<ApiChecklistItem>(`/technician/jobs/${jobId}/checklist/${itemId}/`, { done }).then((r) => r.data);
export const completeJob = (id: number | string, signature_svg: string) =>
  api.post<ApiJobDetail>(`/technician/jobs/${id}/complete/`, { signature_svg }).then((r) => r.data);

export const uploadJobPhoto = (jobId: number | string, kind: 'before' | 'after', uri: string) => {
  const form = new FormData();
  form.append('kind', kind);
  form.append('image', filePart(uri, `${kind}.jpg`));
  return api
    .post<ApiPhoto>(`/technician/jobs/${jobId}/photos/`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);
};
export const deleteJobPhoto = (jobId: number | string, photoId: number) => api.delete(`/technician/jobs/${jobId}/photos/${photoId}/`);

export const sendLocation = (latitude: number, longitude: number, heading = 0) =>
  api.post('/technician/location/', { latitude: latitude.toFixed(6), longitude: longitude.toFixed(6), heading });
