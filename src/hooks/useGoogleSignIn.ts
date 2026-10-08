import { useCallback, useRef } from 'react';
import { Alert } from '../components/AppAlert';
import { GoogleSignInError, signInWithGoogle } from '../api/googleAuth';
import { saveSession } from '../api/session';
import { AuthResponse } from '../api/types';

/** Returns a handler for the "Continue with Google" button. */
export function useGoogleSignIn(role: 'customer' | 'technician' | undefined, onDone?: (auth: AuthResponse) => void) {
  const busy = useRef(false);

  return useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      const session = await signInWithGoogle(role);
      if (!session) return;
      await saveSession(session);
      onDone?.(session);
    } catch (error) {
      const message = error instanceof GoogleSignInError ? error.message : 'Something went wrong. Please try again.';
      Alert.alert('Google sign-in', message);
    } finally {
      busy.current = false;
    }
  }, [role, onDone]);
}
