import { ReactNode, useEffect, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AuthInput from '../../components/AuthInput';
import FadeIn from '../../components/FadeIn';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import SelectField from '../../components/SelectField';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { UserProfile } from '../../types/profile';
import { apiFieldErrors, apiMessage } from '../../api/errors';
import { profileFromUser } from '../../api/mappers';
import { ProfileChanges, updateMe } from '../../api/shared';
import { chooseProfilePhoto } from '../../utils/pickImage';

const SPECIALTIES = [
  'Exterior detailing',
  'Interior detailing',
  'Ceramic coating',
  'Paint correction',
  'Polishing & denting',
  'All-round detailer',
];
const EXPERIENCE = ['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years'];
const BIO_MAX = 200;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({ label, optional, children }: { label: string; optional?: boolean; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {optional ? <Text style={styles.optional}> (optional)</Text> : null}
      </Text>
      {children}
    </View>
  );
}

type Props = {
  profile: UserProfile;
  /** Technicians also fill in a specialty and experience. */
  role: 'customer' | 'technician';
  onBack?: () => void;
  onSave: (profile: UserProfile) => void;
};

// Change your photo and details. Nothing is sent to the server until you press Save.
export default function EditProfileScreen({ profile, role, onBack, onSave }: Props) {
  const [form, setForm] = useState<UserProfile>(profile);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const set = (key: keyof UserProfile) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const nameError = submitted && !form.name.trim();
  const emailError = submitted && form.email.trim() !== '' && !EMAIL.test(form.email.trim());
  const phoneError = submitted && form.phone.trim() !== '' && form.phone.replace(/\D/g, '').length < 7;
  const valid = !!form.name.trim() && !(form.email.trim() && !EMAIL.test(form.email.trim())) &&
    !(form.phone.trim() && form.phone.replace(/\D/g, '').length < 7);

  const changePhoto = async () => {
    const uri = await chooseProfilePhoto();
    if (uri) setForm((f) => ({ ...f, photo: uri }));
  };

  const save = async () => {
    if (saving) return;
    setSubmitted(true);
    setServerError('');
    if (!valid) return;
    const changes: ProfileChanges = {
      full_name: form.name.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      bio: form.bio.trim(),
    };
    if (role === 'technician') {
      changes.specialty = form.specialty;
      changes.experience = form.experience;
    }
    // A photo already on the server is an http link; a new one is a file on the phone.
    if (form.photo && form.photo !== profile.photo) changes.photoUri = form.photo;
    if (!form.photo && profile.photo) changes.remove_photo = true;
    setSaving(true);
    try {
      onSave(profileFromUser(await updateMe(changes)));
      setSaved(true);
      timer.current = setTimeout(() => onBack?.(), 700);
    } catch (e) {
      const fields = apiFieldErrors(e);
      setServerError(Object.values(fields)[0] ?? apiMessage(e, 'Could not save your changes. Please try again.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title="Edit Profile" onBack={onBack} font="redhat" />
      </FadeIn>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FadeIn delay={150} distance={20} style={styles.photoWrap}>
            <Pressable onPress={changePhoto} style={styles.photoButton} accessibilityLabel="Change profile photo">
              <View style={styles.avatar}>
                {form.photo ? (
                  <Image source={{ uri: form.photo }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>{form.name.trim().charAt(0).toUpperCase() || '?'}</Text>
                )}
              </View>
              <View style={styles.camera}>
                <Text style={styles.cameraText}>＋</Text>
              </View>
            </Pressable>
            <Pressable onPress={changePhoto} hitSlop={10}>
              <Text style={styles.changePhoto}>{form.photo ? 'Change photo' : 'Add photo'}</Text>
            </Pressable>
            {form.photo && (
              <Pressable onPress={() => setForm((f) => ({ ...f, photo: undefined }))} hitSlop={10}>
                <Text style={styles.removePhoto}>Remove photo</Text>
              </Pressable>
            )}
          </FadeIn>

          <FadeIn delay={250}>
            <Field label="Full Name">
              <AuthInput
                placeholder="Enter your full name"
                value={form.name === 'Guest' ? '' : form.name}
                onChangeText={set('name')}
                autoCapitalize="words"
                textContentType="name"
                error={nameError}
              />
            </Field>
          </FadeIn>
          <FadeIn delay={310}>
            <Field label="Email Address" optional>
              <AuthInput
                placeholder="Enter your email"
                value={form.email}
                onChangeText={set('email')}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                // The email is the account's sign-in; the server doesn't let it be changed here.
                editable={false}
                error={emailError}
              />
            </Field>
          </FadeIn>
          <FadeIn delay={370}>
            <Field label="Phone Number" optional>
              <AuthInput
                placeholder="Enter your phone number"
                value={form.phone}
                onChangeText={set('phone')}
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                error={phoneError}
              />
            </Field>
          </FadeIn>
          <FadeIn delay={430}>
            <Field label="City" optional>
              <AuthInput placeholder="e.g. Beverly Hills, CA" value={form.city} onChangeText={set('city')} autoCapitalize="words" />
            </Field>
          </FadeIn>

          {role === 'technician' && (
            <>
              <FadeIn delay={490}>
                <Field label="Specialty">
                  <SelectField
                    title="Select your specialty"
                    placeholder="Select your specialty"
                    options={SPECIALTIES}
                    value={form.specialty}
                    onChange={set('specialty')}
                  />
                </Field>
              </FadeIn>
              <FadeIn delay={550}>
                <Field label="Experience">
                  <SelectField
                    title="Select your experience"
                    placeholder="Select your experience"
                    options={EXPERIENCE}
                    value={form.experience}
                    onChange={set('experience')}
                  />
                </Field>
              </FadeIn>
            </>
          )}

          <FadeIn delay={610}>
            <Field label="About You" optional>
              <AuthInput
                multiline
                placeholder="Tell customers a little about yourself"
                value={form.bio}
                onChangeText={(t) => set('bio')(t.slice(0, BIO_MAX))}
                maxLength={BIO_MAX}
              />
              <Text style={styles.counter}>
                {form.bio.length}/{BIO_MAX}
              </Text>
            </Field>
          </FadeIn>
        </ScrollView>
      </KeyboardAvoidingView>

      <FadeIn delay={700} distance={40} style={styles.footer}>
        {saved ? (
          <View style={styles.savedButton}>
            <Text style={styles.savedText}>Saved ✓</Text>
          </View>
        ) : (
          <>
            {!!serverError && <Text style={styles.serverError}>{serverError}</Text>}
            <PrimaryButton title="Save Changes" onPress={save} loading={saving} />
          </>
        )}
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  flex: { flex: 1 },
  content: { paddingTop: 24, paddingHorizontal: 24, paddingBottom: 120, gap: 16 },
  serverError: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.red, textAlign: 'center', marginBottom: 12 },
  photoWrap: { alignItems: 'center', gap: 8 },
  photoButton: { width: 96, height: 96 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 32,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,138,0,0.15)',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { fontFamily: 'RedHatDisplay_700Bold', fontSize: 40, color: colors.primary },
  camera: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.background,
  },
  cameraText: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, lineHeight: 20, color: colors.white },
  changePhoto: { fontFamily: 'Poppins_500Medium', fontSize: 13, color: colors.primary },
  removePhoto: { fontFamily: 'Poppins_500Medium', fontSize: 11, color: colors.textSecondary },
  field: { gap: 8 },
  label: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.white },
  optional: { fontSize: 8 },
  counter: { alignSelf: 'flex-end', fontFamily: 'Poppins_400Regular', fontSize: 10, color: colors.textSecondary },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    backgroundColor: colors.background,
  },
  savedButton: {
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
  },
  savedText: { fontFamily: 'Poppins_500Medium', fontSize: 16, color: colors.white },
});
