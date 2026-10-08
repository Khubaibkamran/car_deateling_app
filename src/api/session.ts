import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { api, API_URL, setTokenRefresher } from './client';

const KEY = 'volvo.session';

export type Tokens = { access: string; refresh: string };

let tokens: Tokens | null = null;
let onExpired: (() => void) | undefined;

/** Called when the refresh token no longer works, so the app can send the person back to sign in. */
export function setSessionExpiredHandler(fn: (() => void) | undefined) {
  onExpired = fn;
}

function apply(next: Tokens | null) {
  tokens = next;
  if (next) api.defaults.headers.common.Authorization = `Bearer ${next.access}`;
  else delete api.defaults.headers.common.Authorization;
}

/** Remembers the signed-in session on the phone and attaches the token to every API call. */
export async function saveSession(next: Tokens) {
  apply({ access: next.access, refresh: next.refresh });
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(tokens));
  } catch {
    // Storage unavailable: the session just won't survive an app restart.
  }
}

export async function clearSession() {
  apply(null);
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}

export const hasSession = () => tokens !== null;

/** A usable access token: if the saved one is about to expire, a new one is fetched first. */
export async function freshAccessToken(): Promise<string | null> {
  if (!tokens) return null;
  try {
    const payload = JSON.parse(atob(tokens.access.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp * 1000 - Date.now() > 30_000) return tokens.access;
  } catch {
    // Unreadable: just try to refresh below.
  }
  return (await refreshAccessToken()) ?? tokens?.access ?? null;
}
export const refreshToken = () => tokens?.refresh;

/** Loads a saved session at app start. Returns true if there was one. */
export async function restoreSession(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const saved = raw ? (JSON.parse(raw) as Tokens) : null;
    if (saved?.access && saved.refresh) {
      apply(saved);
      return true;
    }
  } catch {
    // Unreadable: treat as signed out.
  }
  return false;
}

let refreshing: Promise<string | null> | null = null;

// One refresh at a time: the server rotates refresh tokens, so two at once would invalidate each other.
const refreshAccessToken = () => {
  if (!tokens) return Promise.resolve(null);
  refreshing ??= axios
    .post<Tokens>(`${API_URL}/auth/refresh/`, { refresh: tokens.refresh }, { timeout: 15000 })
    .then(async ({ data }) => {
      await saveSession({ access: data.access, refresh: data.refresh ?? tokens!.refresh });
      return data.access;
    })
    .catch(async (error) => {
      // Only a rejected token ends the session; a network blip shouldn't sign the person out.
      if (error?.response?.status === 401 || error?.response?.status === 400) {
        await clearSession();
        onExpired?.();
      }
      return null;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
};
setTokenRefresher(refreshAccessToken);
