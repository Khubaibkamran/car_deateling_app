import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AuthInput from '../../components/AuthInput';
import BrandHeader from '../../components/BrandHeader';
import Checkbox from '../../components/Checkbox';
import FadeIn from '../../components/FadeIn';
import { EmailIcon, LockIcon } from '../../components/icons';
import PrimaryButton from '../../components/PrimaryButton';
import SocialAuth from '../../components/SocialAuth';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 6;

type Props = {
  role: 'customer' | 'technician';
  /** Called with the email once the form is valid. */
  onSignIn?: (email: string) => void;
  onSignUp?: () => void;
  onForgotPassword?: () => void;
  /** Called with the person's details after "Continue with Google" succeeds. */
  onGoogle?: (user: { email: string; name: string }) => void;
};

// Sign in for customers and technicians. There's no auth server yet, so any well-formed
// email and password gets you in; the checks below are the rules the real server will also enforce.
export default function SignInScreen({ role, onSignIn, onSignUp, onForgotPassword, onGoogle }: Props) {
  const google = useGoogleSignIn(role, onGoogle);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const emailError = submitted && !EMAIL.test(email.trim());
  const passwordError = submitted && password.length < MIN_PASSWORD;

  const submit = () => {
    setSubmitted(true);
    if (!EMAIL.test(email.trim()) || password.length < MIN_PASSWORD) return;
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      onSignIn?.(email.trim());
    }, 800);
  };

  return (
    <View style={styles.container}>
      <TireBackground />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <FadeIn delay={100} distance={-16} style={styles.header}>
            <BrandHeader />
          </FadeIn>

          <FadeIn delay={250} distance={20} style={styles.heading}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              {role === 'technician'
                ? 'Sign in to see your jobs and earnings.'
                : 'Sign in to book car care your way.'}
            </Text>
          </FadeIn>

          <View style={styles.form}>
            <View style={styles.fields}>
              <FadeIn delay={400}>
                <AuthInput
                  icon={<EmailIcon />}
                  placeholder="Enter email address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  error={emailError}
                />
                {emailError && <Text style={styles.error}>Enter a valid email address.</Text>}
              </FadeIn>
              <FadeIn delay={480}>
                <AuthInput
                  icon={<LockIcon />}
                  placeholder="Enter password"
                  value={password}
                  onChangeText={setPassword}
                  password
                  autoCapitalize="none"
                  textContentType="password"
                  onSubmitEditing={submit}
                  error={passwordError}
                />
                {passwordError && <Text style={styles.error}>Password must be at least {MIN_PASSWORD} characters.</Text>}
              </FadeIn>
              <FadeIn delay={560} style={styles.optionsRow}>
                <View style={styles.remember}>
                  <Checkbox checked={remember} onChange={setRemember} />
                  <Text style={styles.rememberText}>Remember me</Text>
                </View>
                <Pressable onPress={onForgotPassword} hitSlop={10}>
                  <Text style={styles.forgot}>Forgot password?</Text>
                </Pressable>
              </FadeIn>
            </View>

            <FadeIn delay={640} distance={30}>
              <PrimaryButton title="Sign In" onPress={submit} loading={loading} />
            </FadeIn>
          </View>

          <FadeIn delay={740} distance={20} style={styles.social}>
            <SocialAuth label="Or sign in with" onGoogle={google} />
            <Text style={styles.footer}>
              Don’t have an account? <Text style={styles.signUp} onPress={onSignUp}>Sign up.</Text>
            </Text>
          </FadeIn>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  flex: { flex: 1 },
  content: { paddingTop: 50, paddingBottom: 40 },
  header: { height: 31 },
  heading: { marginTop: 50, paddingHorizontal: 24, gap: 8 },
  title: { fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: colors.text },
  subtitle: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.textSecondary },
  form: { marginTop: 24, paddingHorizontal: 24, gap: 32 },
  fields: { gap: 18 },
  error: { fontFamily: 'Poppins_500Medium', fontSize: 11, color: colors.red, marginTop: 6, marginLeft: 4 },
  optionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  remember: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rememberText: { fontFamily: 'Poppins_400Regular', fontSize: 13, color: colors.textSecondary },
  forgot: { fontFamily: 'Poppins_500Medium', fontSize: 13, color: colors.primary },
  social: { marginTop: 40, alignItems: 'center', gap: 24 },
  footer: { fontFamily: 'Poppins_400Regular', fontSize: 14, lineHeight: 21, color: colors.textSecondary },
  signUp: { fontFamily: 'Poppins_500Medium', color: colors.primary },
});
