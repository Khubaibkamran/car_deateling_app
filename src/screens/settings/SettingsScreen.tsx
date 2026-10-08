import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { apiFieldErrors, apiMessage } from '../../api/errors';
import { changePassword } from '../../api/shared';
import AuthInput from '../../components/AuthInput';
import FadeIn from '../../components/FadeIn';
import { LockIcon } from '../../components/icons';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';

const MIN_PASSWORD = 6;

// Account settings: change the password.
export default function SettingsScreen({ onBack }: { onBack?: () => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const problems: Record<string, string> = {};
  if (!current) problems.current_password = 'Enter your current password.';
  if (next.length < MIN_PASSWORD) problems.new_password = `Use at least ${MIN_PASSWORD} characters.`;
  if (confirm !== next) problems.confirm = 'Passwords don’t match.';
  const shown = submitted ? { ...problems, ...errors } : {};

  const save = async () => {
    if (loading) return;
    setSubmitted(true);
    setErrors({});
    setDone(false);
    if (Object.keys(problems).length) return;
    setLoading(true);
    try {
      await changePassword(current, next);
      setCurrent('');
      setNext('');
      setConfirm('');
      setSubmitted(false);
      setDone(true);
    } catch (e) {
      const fields = apiFieldErrors(e);
      setErrors(Object.keys(fields).length ? fields : { form: apiMessage(e) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title="Settings" onBack={onBack} font="redhat" />
      </FadeIn>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <FadeIn delay={100} style={styles.heading}>
            <Text style={styles.title}>Change password</Text>
            <Text style={styles.subtitle}>Choose a strong password you haven’t used before.</Text>
          </FadeIn>
          <FadeIn delay={200} distance={20} style={styles.fields}>
            <View>
              <AuthInput icon={<LockIcon />} placeholder="Current password" value={current} onChangeText={setCurrent} password autoCapitalize="none" error={!!shown.current_password} />
              {!!shown.current_password && <Text style={styles.error}>{shown.current_password}</Text>}
            </View>
            <View>
              <AuthInput icon={<LockIcon />} placeholder="New password" value={next} onChangeText={setNext} password autoCapitalize="none" error={!!shown.new_password} />
              {!!shown.new_password && <Text style={styles.error}>{shown.new_password}</Text>}
            </View>
            <View>
              <AuthInput icon={<LockIcon />} placeholder="Confirm new password" value={confirm} onChangeText={setConfirm} password autoCapitalize="none" error={!!shown.confirm} />
              {!!shown.confirm && <Text style={styles.error}>{shown.confirm}</Text>}
            </View>
            {!!shown.form && <Text style={styles.error}>{shown.form}</Text>}
            {done && <Text style={styles.success}>Your password has been updated.</Text>}
            <PrimaryButton title="Update Password" onPress={save} loading={loading} />
          </FadeIn>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  flex: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 50, gap: 24 },
  heading: { gap: 4 },
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, color: colors.white },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.textSecondary },
  fields: { gap: 18 },
  error: { fontFamily: 'Poppins_500Medium', fontSize: 11, color: colors.red, marginTop: 6, marginLeft: 4 },
  success: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.green, textAlign: 'center' },
});
