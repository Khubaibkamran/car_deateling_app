import { TurboModuleRegistry } from 'react-native';
import { api } from './client';
import { AuthResponse } from './types';

export type GoogleSession = AuthResponse & { created: boolean };

// The Web client ID from Firebase console > Authentication > Sign-in method > Google
// (or Google Cloud console > Credentials > "Web client (auto created by Google Service)").
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

/** Thrown with a message that is safe to show the person. */
export class GoogleSignInError extends Error {}

/**
 * Opens the Google account picker, then trades the Google token for a Volvo session.
 * Resolves to null if the person closed the picker. Needs a development/production build:
 * the native module is not part of Expo Go.
 */
export async function signInWithGoogle(role?: 'customer' | 'technician'): Promise<GoogleSession | null> {
  // Expo Go doesn't contain the native module; requiring the package there crashes, so look first.
  if (!TurboModuleRegistry.get('RNGoogleSignin')) {
    throw new GoogleSignInError('Google sign-in needs the Volvo development build; it does not run in Expo Go.');
  }
  let mod: typeof import('@react-native-google-signin/google-signin');
  try {
    mod = require('@react-native-google-signin/google-signin');
    mod.GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });
  } catch {
    throw new GoogleSignInError('Google sign-in needs the Volvo development build; it does not run in Expo Go.');
  }
  if (!WEB_CLIENT_ID) throw new GoogleSignInError('Google sign-in is not set up yet (missing web client ID).');

  const { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } = mod;
  let idToken: string | null = null;
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) return null; // cancelled
    idToken = response.data.idToken;
  } catch (error) {
    if (isErrorWithCode(error)) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED || error.code === statusCodes.IN_PROGRESS) return null;
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new GoogleSignInError('Google Play services are not available on this device.');
      }
    }
    throw new GoogleSignInError('Could not sign in with Google. Please try again.');
  }
  if (!idToken) throw new GoogleSignInError('Google did not return a sign-in token. Please try again.');

  try {
    const { data } = await api.post<GoogleSession>('/auth/google/', { id_token: idToken, role });
    return data;
  } catch (error: any) {
    const body = error?.response?.data;
    const message = body?.detail ?? body?.role ?? (error?.response ? undefined : 'Cannot reach the server. Check your connection.');
    throw new GoogleSignInError(typeof message === 'string' ? message : 'Google sign-in failed. Please try again.');
  }
}
