import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AuthInput from '../../components/AuthInput';
import FadeIn from '../../components/FadeIn';
import { BackIcon } from '../../components/icons';
import PrimaryButton from '../../components/PrimaryButton';
import SelectField from '../../components/SelectField';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { COLOR_OPTIONS, modelsForMake, yearOptions } from '../../constants/vehicleOptions';

export type NewVehicle = {
  make: string;
  model: string;
  year: string;
  color: string;
  plate: string;
  notes: string;
};

type Props = {
  onBack?: () => void;
  onSave?: (vehicle: NewVehicle) => void;
  onBookService?: (vehicle: NewVehicle) => void;
};

const EMPTY: NewVehicle = { make: '', model: '', year: '', color: '', plate: '', notes: '' };
const REQUIRED: (keyof NewVehicle)[] = ['make', 'model', 'year', 'color', 'plate'];

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
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

export default function AddVehicleScreen({ onBack, onSave, onBookService }: Props) {
  const [form, setForm] = useState<NewVehicle>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof NewVehicle) => (value: string) =>
    setForm((f) => ({
      ...f,
      [key]: value,
      // A different make has different models, so drop a model that no longer applies.
      ...(key === 'make' ? { model: '' } : null),
    }));

  const models = useMemo(() => modelsForMake(form.make), [form.make]);
  const years = useMemo(yearOptions, []);

  const missing = (key: keyof NewVehicle) => submitted && REQUIRED.includes(key) && !form[key].trim();
  const valid = REQUIRED.every((k) => form[k].trim());

  const submit = (then?: (v: NewVehicle) => void) => {
    setSubmitted(true);
    if (!valid) return;
    then?.({ ...form, make: form.make.trim(), plate: form.plate.trim().toUpperCase(), notes: form.notes.trim() });
  };

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />

      <FadeIn delay={50} distance={-12} style={styles.header}>
        <Pressable onPress={onBack} hitSlop={14} style={styles.back} accessibilityLabel="Go back">
          <BackIcon />
        </Pressable>
        <Text style={styles.title}>Add Vehicle</Text>
      </FadeIn>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FadeIn delay={150}>
            <Field label="Vehicle Make">
              <AuthInput
                placeholder="Enter vehicle make"
                hint="(e.g. BMW)"
                value={form.make}
                onChangeText={set('make')}
                autoCapitalize="words"
                error={missing('make')}
              />
            </Field>
          </FadeIn>
          <FadeIn delay={220}>
            <Field label="Vehicle Model">
              <SelectField
                title="Select vehicle model"
                placeholder="Select vehicle model"
                options={models}
                value={form.model}
                onChange={set('model')}
                error={missing('model')}
              />
            </Field>
          </FadeIn>
          <FadeIn delay={290}>
            <Field label="Year">
              <SelectField
                title="Select year"
                placeholder="Select year"
                options={years}
                value={form.year}
                onChange={set('year')}
                error={missing('year')}
              />
            </Field>
          </FadeIn>
          <FadeIn delay={360}>
            <Field label="Vehicle Color">
              <SelectField
                title="Select color"
                placeholder="Select color"
                options={COLOR_OPTIONS}
                value={form.color}
                onChange={set('color')}
                error={missing('color')}
              />
            </Field>
          </FadeIn>
          <FadeIn delay={430}>
            <Field label="License Plate">
              <AuthInput
                placeholder="Enter license plate number"
                value={form.plate}
                onChangeText={set('plate')}
                autoCapitalize="characters"
                autoCorrect={false}
                error={missing('plate')}
              />
            </Field>
          </FadeIn>
          <FadeIn delay={500}>
            <Field label="Other" optional>
              <AuthInput
                multiline
                placeholder="Mention specifications, defaults etc"
                value={form.notes}
                onChangeText={set('notes')}
              />
            </Field>
          </FadeIn>
        </ScrollView>
      </KeyboardAvoidingView>

      <FadeIn delay={600} distance={40} style={styles.footer}>
        <PrimaryButton title="Save Vehicle" onPress={() => submit(onSave)} />
        <PrimaryButton title="Book a Service" variant="outline" onPress={() => submit(onBookService)} />
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  flex: { flex: 1 },
  header: { marginTop: 50, height: 24, justifyContent: 'center', alignItems: 'center' },
  back: { position: 'absolute', left: 24 },
  title: { fontFamily: 'Poppins_500Medium', fontSize: 16, letterSpacing: 0.32, color: colors.white },
  form: { paddingTop: 40, paddingHorizontal: 24, paddingBottom: 190, gap: 16 },
  field: { gap: 8 },
  label: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.white },
  optional: { fontSize: 8 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 12,
    backgroundColor: colors.background,
  },
});
