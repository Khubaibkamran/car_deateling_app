import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AuthInput from '../../components/AuthInput';
import BrandHeader from '../../components/BrandHeader';
import Checkbox from '../../components/Checkbox';
import { SuccessBadge } from '../../components/flowIcons';
import ModalCard from '../../components/ModalCard';
import FadeIn from '../../components/FadeIn';
import { EmailIcon, LockIcon, UserIcon } from '../../components/icons';
import SocialAuth from '../../components/SocialAuth';
import PrimaryButton from '../../components/PrimaryButton';
import TireBackground from '../../components/TireBackground';
import { register } from '../../api/auth';
import { apiFieldErrors, apiMessage } from '../../api/errors';
import { saveSession } from '../../api/session';
import { AuthResponse } from '../../api/types';
import { colors } from '../../constants/theme';
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 6;

type Props = {
  /** Changes the wording for technicians; the form is the same. */
  role?: 'customer' | 'technician';
  /** Called with the new account's session (tokens + user) once it is created. */
  onSignUp?: (auth: AuthResponse) => void;
  onSignIn?: () => void;
  /** Called with the server's session after "Continue with Google" succeeds. */
  onGoogle?: (auth: AuthResponse) => void;
};

export default function SignupCustomerScreen({ role = 'customer', onSignUp, onSignIn, onGoogle }: Props) {
  const google = useGoogleSignIn(role, onGoogle);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // The new account, shown a welcome message before the app opens.
  const [welcome, setWelcome] = useState<AuthResponse | null>(null);

  const problems: Record<string, string> = {};
  if (!fullName.trim()) problems.full_name = 'Enter your full name.';
  if (!EMAIL.test(email.trim())) problems.email = 'Enter a valid email address.';
  if (password.length < MIN_PASSWORD) problems.password = `Password must be at least ${MIN_PASSWORD} characters.`;
  if (confirm !== password) problems.confirm = 'Passwords don’t match.';
  if (!agreed) problems.terms = 'Please accept the Terms & Privacy policy.';
  const shown = submitted ? { ...problems, ...errors } : {};

  const submit = async () => {
    if (loading) return;
    setSubmitted(true);
    setErrors({});
    if (Object.keys(problems).length) return;
    setLoading(true);
    try {
      const auth = await register({ email, password, full_name: fullName.trim(), role });
      await saveSession(auth);
      setWelcome(auth);
    } catch (error) {
      const fields = apiFieldErrors(error);
      setErrors(Object.keys(fields).length ? fields : { form: apiMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TireBackground />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FadeIn delay={100} distance={-16} style={styles.header}>
            <BrandHeader />
          </FadeIn>

          <FadeIn delay={250} distance={20} style={styles.heading}>
            <Text style={styles.title}>Let’s get you started</Text>
            <Text style={styles.subtitle}>
              {role === 'technician'
                ? 'Create your technician account and start taking jobs.'
                : 'Create your account and book car care your way.'}
            </Text>
          </FadeIn>

          <View style={styles.form}>
            <View style={styles.fields}>
              <FadeIn delay={400}>
                <AuthInput
                  icon={<UserIcon />}
                  placeholder="Enter full name"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  textContentType="name"
                  error={!!shown.full_name}
                />
                {!!shown.full_name && <Text style={styles.error}>{shown.full_name}</Text>}
              </FadeIn>
              <FadeIn delay={480}>
                <AuthInput
                  icon={<EmailIcon />}
                  placeholder="Enter email address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  error={!!shown.email}
                />
                {!!shown.email && <Text style={styles.error}>{shown.email}</Text>}
              </FadeIn>
              <FadeIn delay={560}>
                <AuthInput
                  icon={<LockIcon />}
                  placeholder="Enter password"
                  value={password}
                  onChangeText={setPassword}
                  password
                  autoCapitalize="none"
                  textContentType="newPassword"
                  error={!!shown.password}
                />
                {!!shown.password && <Text style={styles.error}>{shown.password}</Text>}
              </FadeIn>
              <FadeIn delay={640}>
                <AuthInput
                  icon={<LockIcon />}
                  placeholder="Confirm password"
                  value={confirm}
                  onChangeText={setConfirm}
                  password
                  autoCapitalize="none"
                  textContentType="newPassword"
                  onSubmitEditing={submit}
                  error={!!shown.confirm}
                />
                {!!shown.confirm && <Text style={styles.error}>{shown.confirm}</Text>}
              </FadeIn>
              <FadeIn delay={720} style={styles.terms}>
                <Checkbox checked={agreed} onChange={setAgreed} />
                <Text style={styles.termsText}>
                  By signing up you agree to the <Text style={styles.link}>Terms</Text> &amp;{' '}
                  <Text style={styles.link}>Privacy policy</Text>
                </Text>
              </FadeIn>
            </View>

            <FadeIn delay={800} distance={30}>
              {!!(shown.terms || shown.form) && <Text style={styles.formError}>{shown.terms || shown.form}</Text>}
              <PrimaryButton title="Sign Up" onPress={submit} loading={loading} />
            </FadeIn>
          </View>

          <FadeIn delay={900} distance={20} style={styles.social}>
            <SocialAuth label="Or sign up with" onGoogle={google} />
            <Text style={styles.footer}>
              Already have an account? <Text style={styles.signIn} onPress={onSignIn}>Sign in.</Text>
            </Text>
          </FadeIn>
        </ScrollView>
      </KeyboardAvoidingView>

      <ModalCard visible={!!welcome} onRequestClose={() => undefined}>
        <View style={styles.badge}>
          <SuccessBadge size={110} />
        </View>
        <Text style={styles.modalTitle}>Welcome to Volvo!</Text>
        <Text style={styles.modalText}>
          {role === 'technician'
            ? `You’re registered successfully, ${welcome?.user.full_name.split(' ')[0] ?? ''}. Start taking jobs and growing your earnings.`
            : `You’re registered successfully, ${welcome?.user.full_name.split(' ')[0] ?? ''}. Let’s book car care your way.`}
        </Text>
        <View style={styles.modalAction}>
          <PrimaryButton title="Get Started" onPress={() => welcome && onSignUp?.(welcome)} />
        </View>
      </ModalCard>
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
  formError: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.red, textAlign: 'center', marginBottom: 12 },
  badge: { alignSelf: 'center', marginTop: -10, marginBottom: -14 },
  modalTitle: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, color: colors.text, textAlign: 'center' },
  modalText: { fontFamily: 'Poppins_500Medium', fontSize: 12, lineHeight: 18, color: colors.textSecondary, textAlign: 'center', marginTop: 6, paddingHorizontal: 8 },
  modalAction: { marginTop: 20 },
  terms: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  termsText: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  link: { fontFamily: 'Poppins_500Medium', color: colors.text },
  social: { marginTop: 36, alignItems: 'center', gap: 24 },
  footer: { fontFamily: 'Poppins_400Regular', fontSize: 14, lineHeight: 21, color: colors.textSecondary },
  signIn: { fontFamily: 'Poppins_500Medium', color: colors.primary },
});
