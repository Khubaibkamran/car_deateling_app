import { isAxiosError } from 'axios';

/** A message that is safe to show: the server's own wording when it sent one. */
export function apiMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!isAxiosError(error)) return fallback;
  if (!error.response) return 'Cannot reach the server. Check your connection.';
  const body = error.response.data;
  if (typeof body === 'string') return fallback;
  if (typeof body?.detail === 'string') return body.detail;
  if (body && typeof body === 'object') {
    for (const value of Object.values(body)) {
      const first = Array.isArray(value) ? value[0] : value;
      if (typeof first === 'string') return first;
    }
  }
  if (error.response.status === 429) return 'Too many attempts. Please wait a moment and try again.';
  return fallback;
}

/** Field-level errors, e.g. `{ email: 'An account with this email already exists.' }`. */
export function apiFieldErrors(error: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!isAxiosError(error) || !error.response || typeof error.response.data !== 'object' || !error.response.data) return out;
  for (const [key, value] of Object.entries(error.response.data as Record<string, unknown>)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (typeof first === 'string') out[key] = first;
  }
  return out;
}
