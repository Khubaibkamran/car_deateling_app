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
import FadeIn from '../../components/FadeIn';
import { EmailIcon, LockIcon, UserIcon } from '../../components/icons';
import SocialAuth from '../../components/SocialAuth';
import PrimaryButton from '../../components/PrimaryButton';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn';

export type SignupValues = { fullName: string; email: string; password: string };

type Props = {
  /** Changes the wording for technicians; the form is the same. */
  role?: 'customer' | 'technician';
  onSignUp?: (values: SignupValues) => void;
  onSignIn?: () => void;
  /** Called with the person's details after "Continue with Google" succeeds. */
  onGoogle?: (user: { email: string; name: string }) => void;
};

export default function SignupCustomerScreen({ role = 'customer', onSignUp, onSignIn, onGoogle }: Props) {
  const google = useGoogleSignIn(role, onGoogle);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(true);

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
                />
              </FadeIn>
              <FadeIn delay={480}>
                <AuthInput
                  icon={<EmailIcon />}
                  placeholder="Enter email address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                />
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
                />
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
                />
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
              <PrimaryButton
                title="Sign Up"
                onPress={() => onSignUp?.({ fullName: fullName.trim(), email: email.trim(), password })}
              />
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
