import { api } from './client';
import { AuthResponse, Role } from './types';

/** The account's own role decides which side of the app opens, so none is sent. */
export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login/', { email: email.trim().toLowerCase(), password }).then((r) => r.data);

export const register = (v: { email: string; password: string; full_name: string; role: Role; phone?: string }) =>
  api.post<AuthResponse>('/auth/register/', { ...v, email: v.email.trim().toLowerCase() }).then((r) => r.data);

export const logout = (refresh: string) => api.post('/auth/logout/', { refresh });

export const forgotPassword = (email: string, role?: Role) =>
  api.post('/auth/password/forgot/', { email: email.trim().toLowerCase(), role });

export const verifyResetCode = (email: string, code: string) =>
  api
    .post<{ reset_token: string }>('/auth/password/verify/', { email: email.trim().toLowerCase(), code })
    .then((r) => r.data.reset_token);

export const resetPassword = (reset_token: string, new_password: string) =>
  api.post('/auth/password/reset/', { reset_token, new_password });
