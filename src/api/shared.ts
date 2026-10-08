import { api, filePart, getAll } from './client';
import { ApiConversation, ApiMessage, ApiNotification, ApiUser } from './types';

// ---- profile (both roles)
export const getMe = () => api.get<ApiUser>('/me/').then((r) => r.data);

export type ProfileChanges = {
  full_name?: string;
  phone?: string;
  city?: string;
  bio?: string;
  specialty?: string;
  experience?: string;
  is_available?: boolean;
  /** Local file URI of a newly chosen photo. */
  photoUri?: string;
  remove_photo?: boolean;
};

export async function updateMe({ photoUri, ...changes }: ProfileChanges) {
  if (photoUri) {
    // A new photo has to go as a multipart form.
    const form = new FormData();
    Object.entries(changes).forEach(([k, v]) => v !== undefined && form.append(k, String(v)));
    form.append('photo', filePart(photoUri, 'profile.jpg'));
    return api.patch<ApiUser>('/me/', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
  }
  return api.patch<ApiUser>('/me/', changes).then((r) => r.data);
}

export const changePassword = (current_password: string, new_password: string) =>
  api.post('/me/password/', { current_password, new_password });

function unreadFrom(data: Record<string, unknown>): number {
  const n = data.unread ?? data.count ?? data.unread_count;
  return typeof n === 'number' ? n : 0;
}

// ---- notifications
export const getNotifications = () => getAll<ApiNotification>('/notifications/');
export const markNotificationRead = (id: number) => api.post(`/notifications/${id}/read/`);
export const markAllNotificationsRead = () => api.post('/notifications/read-all/');
export const getUnreadNotifications = () =>
  api.get<Record<string, unknown>>('/notifications/unread-count/').then((r) => unreadFrom(r.data));

// ---- chat
export const getConversations = () => getAll<ApiConversation>('/conversations/');
export const getUnreadMessages = () =>
  api.get<Record<string, unknown>>('/conversations/unread-count/').then((r) => unreadFrom(r.data));
export const openSupportConversation = () => api.post<ApiConversation>('/conversations/support/').then((r) => r.data);

/** Messages oldest first (the newest 100). Pass `after` (a message id) to fetch only newer ones. */
export async function getMessages(conversationId: number, after?: number) {
  const { data } = await api.get<ApiMessage[]>(`/conversations/${conversationId}/messages/`, {
    params: after ? { after } : undefined,
  });
  return [...data].sort((a, b) => a.id - b.id);
}
export const sendMessage = (conversationId: number, text: string) =>
  api.post<ApiMessage>(`/conversations/${conversationId}/messages/`, { text }).then((r) => r.data);

// ---- push
export const registerDevice = (token: string, platform: 'android' | 'ios') => api.post('/devices/', { token, platform });
