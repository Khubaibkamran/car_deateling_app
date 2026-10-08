import { useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { GoogleSignInError, signInWithGoogle } from '../api/googleAuth';
import { saveSession } from '../api/session';

/** Returns a handler for the "Continue with Google" button. */
export function useGoogleSignIn(role: 'customer' | 'technician', onDone?: (user: { email: string; name: string }) => void) {
  const busy = useRef(false);

  return useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      const session = await signInWithGoogle(role);
      if (!session) return;
      await saveSession(session);
      onDone?.({ email: session.user.email, name: session.user.full_name });
    } catch (error) {
      const message = error instanceof GoogleSignInError ? error.message : 'Something went wrong. Please try again.';
      Alert.alert('Google sign-in', message);
    } finally {
      busy.current = false;
    }
  }, [role, onDone]);
}
