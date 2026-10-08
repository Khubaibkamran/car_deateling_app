import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AuthInput from '../../components/AuthInput';
import FadeIn from '../../components/FadeIn';
import { SuccessBadge } from '../../components/flowIcons';
import { EmailIcon, LockIcon } from '../../components/icons';
import ModalCard from '../../components/ModalCard';
import OtpInput from '../../components/OtpInput';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import TireBackground from '../../components/TireBackground';
import { forgotPassword, resetPassword, verifyResetCode } from '../../api/auth';
import { apiMessage } from '../../api/errors';
import { colors } from '../../constants/theme';

type Step = 'email' | 'code' | 'reset';
const STEPS: Step[] = ['email', 'code', 'reset'];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;
const MIN_PASSWORD = 6;

/** "john.smith@mail.com" -> "j***@mail.com" */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  return `${local.charAt(0)}***@${domain}`;
}

const COPY: Record<Step, { title: string; subtitle: (email: string) => string; button: string }> = {
  email: {
    title: 'Forgot your password?',
    subtitle: () =>
      'Enter the email linked to your account and we’ll send you a code to reset it.',
    button: 'Send Reset Code',
  },
  code: {
    title: 'Check your email',
    subtitle: (email) => `We sent a ${CODE_LENGTH}-digit code to ${maskEmail(email)}. Enter it below to continue.`,
    button: 'Verify Code',
  },
  reset: {
    title: 'Create a new password',
    subtitle: () => 'Choose a strong password you haven’t used before.',
    button: 'Reset Password',
  },
};

type Props = {
  /** Leaves the flow from its first step. */
  onBack?: () => void;
  /** Called after the password is reset and the success message is closed. */
  onDone?: () => void;
};

// Reset a forgotten password in three steps: email a code, check the code, then set a new password.
export default function ForgotPasswordScreen({ onBack, onDone }: Props) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [resent, setResent] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [serverError, setServerError] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const index = STEPS.indexOf(step);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    Animated.timing(progress, { toValue: index, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [index, progress]);

  // Resend countdown while on the code step.
  useEffect(() => {
    if (step !== 'code' || seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [step, seconds]);

  const emailOk = EMAIL.test(email.trim());
  const hasLength = password.length >= MIN_PASSWORD;
  const passwordOk = hasLength;
  const matches = password === confirm;

  const goTo = (next: Step) => {
    setSubmitted(false);
    setServerError('');
    setStep(next);
  };

  const submit = async () => {
    if (loading) return;
    setSubmitted(true);
    setServerError('');
    if (step === 'email' && !emailOk) return;
    if (step === 'code' && code.length < CODE_LENGTH) return;
    if (step === 'reset' && (!passwordOk || !matches)) return;
    setLoading(true);
    try {
      if (step === 'email') {
        await forgotPassword(email);
        setSeconds(RESEND_SECONDS);
        setCode('');
        goTo('code');
      } else if (step === 'code') {
        setResetToken(await verifyResetCode(email, code));
        goTo('reset');
      } else {
        await resetPassword(resetToken, password);
        setDone(true);
      }
    } catch (error) {
      setServerError(apiMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const back = () => {
    if (index === 0) onBack?.();
    else goTo(STEPS[index - 1]);
  };

  const resend = async () => {
    setServerError('');
    try {
      await forgotPassword(email);
      setSeconds(RESEND_SECONDS);
      setCode('');
      setResent(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setResent(false), 2500);
    } catch (error) {
      setServerError(apiMessage(error));
    }
  };

  const copy = COPY[step];

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title="Forgot Password" onBack={back} font="redhat" />
      </FadeIn>

      <FadeIn delay={120} style={styles.progress}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.track}>
            <Animated.View
              style={[
                styles.fill,
                { width: progress.interpolate({ inputRange: [i - 1, i], outputRange: ['0%', '100%'], extrapolate: 'clamp' }) },
              ]}
            />
          </View>
        ))}
      </FadeIn>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Keyed by step so each step fades in fresh. */}
          <FadeIn key={step} delay={50} distance={24}>
            <View style={styles.hero}>
              {step === 'email' && <EmailIcon size={34} />}
              {step === 'code' && <EmailIcon size={34} />}
              {step === 'reset' && <LockIcon size={34} />}
            </View>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.subtitle(email.trim())}</Text>

            <View style={styles.body}>
              {step === 'email' && (
                <View>
                  <AuthInput
                    icon={<EmailIcon />}
                    placeholder="Enter email address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    onSubmitEditing={submit}
                    error={submitted && !emailOk}
                  />
                  {submitted && !emailOk && <Text style={styles.error}>Enter a valid email address.</Text>}
                </View>
              )}

              {step === 'code' && (
                <View style={styles.codeBlock}>
                  <OtpInput value={code} onChange={setCode} length={CODE_LENGTH} />
                  {submitted && code.length < CODE_LENGTH && (
                    <Text style={styles.codeError}>Enter the {CODE_LENGTH}-digit code.</Text>
                  )}
                  <View style={styles.resendRow}>
                    {resent ? (
                      <Text style={styles.resent}>A new code is on its way.</Text>
                    ) : seconds > 0 ? (
                      <Text style={styles.resendWait}>
                        Resend code in 0:{`${seconds}`.padStart(2, '0')}
                      </Text>
                    ) : (
                      <Pressable onPress={resend} hitSlop={10}>
                        <Text style={styles.resend}>Resend code</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              )}

              {step === 'reset' && (
                <View style={styles.fields}>
                  <View>
                    <AuthInput
                      icon={<LockIcon />}
                      placeholder="New password"
                      value={password}
                      onChangeText={setPassword}
                      password
                      autoCapitalize="none"
                      autoFocus
                      textContentType="newPassword"
                      error={submitted && !passwordOk}
                    />
                    <View style={styles.rules}>
                      <Rule ok={hasLength} text={`At least ${MIN_PASSWORD} characters`} />
                    </View>
                  </View>
                  <View>
                    <AuthInput
                      icon={<LockIcon />}
                      placeholder="Confirm new password"
                      value={confirm}
                      onChangeText={setConfirm}
                      password
                      autoCapitalize="none"
                      textContentType="newPassword"
                      onSubmitEditing={submit}
                      error={submitted && !matches}
                    />
                    {submitted && !matches && <Text style={styles.error}>Passwords don’t match.</Text>}
                  </View>
                </View>
              )}
              {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}
            </View>
          </FadeIn>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <PrimaryButton title={copy.button} onPress={submit} loading={loading} />
      </View>

      <ModalCard visible={done} onRequestClose={() => undefined}>
        <View style={styles.badge}>
          <SuccessBadge size={110} />
        </View>
        <Text style={styles.modalTitle}>Password Reset!</Text>
        <Text style={styles.modalText}>Your password has been updated. You can now sign in with your new password.</Text>
        <View style={styles.modalAction}>
          <PrimaryButton title="Back to Sign In" onPress={() => onDone?.()} />
        </View>
      </ModalCard>
    </View>
  );
}

function Rule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <View style={styles.rule}>
      <View style={[styles.ruleDot, ok && styles.ruleDotOk]} />
      <Text style={[styles.ruleText, ok && styles.ruleTextOk]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  flex: { flex: 1 },
  progress: { marginTop: 24, marginHorizontal: 24, flexDirection: 'row', gap: 8 },
  track: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2, backgroundColor: colors.primary },
  content: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 140 },
  hero: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,138,0,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,138,0,0.6)',
    marginBottom: 24,
  },
  title: { fontFamily: 'Poppins_600SemiBold', fontSize: 20, color: colors.text },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 14, lineHeight: 21, color: colors.textSecondary, marginTop: 8 },
  body: { marginTop: 28 },
  fields: { gap: 18 },
  serverError: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.red, textAlign: 'center', marginTop: 12 },
  error: { fontFamily: 'Poppins_500Medium', fontSize: 11, color: colors.red, marginTop: 6, marginLeft: 4 },
  codeBlock: { gap: 20 },
  codeError: { fontFamily: 'Poppins_500Medium', fontSize: 11, color: colors.red, textAlign: 'center', marginTop: -8 },
  resendRow: { alignItems: 'center' },
  resendWait: { fontFamily: 'Poppins_500Medium', fontSize: 13, color: colors.textSecondary },
  resend: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: colors.primary },
  resent: { fontFamily: 'Poppins_500Medium', fontSize: 13, color: colors.green },
  rules: { gap: 6, marginTop: 12, marginLeft: 4 },
  rule: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ruleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  ruleDotOk: { backgroundColor: colors.green },
  ruleText: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
  ruleTextOk: { color: colors.text },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 32, backgroundColor: colors.background },
  badge: { alignSelf: 'center', marginTop: -10, marginBottom: -14 },
  modalTitle: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, color: colors.text, textAlign: 'center' },
  modalText: { fontFamily: 'Poppins_500Medium', fontSize: 12, lineHeight: 18, color: colors.textSecondary, textAlign: 'center', marginTop: 6, paddingHorizontal: 8 },
  modalAction: { marginTop: 20 },
});
