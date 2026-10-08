import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './client';

const KEY = 'volvo.session';

export type Tokens = { access: string; refresh: string };

/** Remembers the signed-in session on the phone and attaches the token to every API call. */
export async function saveSession(tokens: Tokens) {
  api.defaults.headers.common.Authorization = `Bearer ${tokens.access}`;
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(tokens));
  } catch {
    // Storage unavailable: the session just won't survive an app restart.
  }
}

export async function clearSession() {
  delete api.defaults.headers.common.Authorization;
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}
