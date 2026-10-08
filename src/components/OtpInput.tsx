import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../constants/theme';

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
};

// One box per digit. A single hidden input does the typing, so paste and autofill from SMS work too.
export default function OtpInput({ value, onChange, length = 6 }: Props) {
  const input = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => input.current?.focus(), 350);
    return () => clearTimeout(id);
  }, []);

  const active = Math.min(value.length, length - 1);

  return (
    <Pressable onPress={() => input.current?.focus()} style={styles.row} accessibilityLabel="Verification code">
      {Array.from({ length }, (_, i) => {
        const digit = value[i];
        const isActive = focused && i === active;
        return (
          <View key={i} style={[styles.box, !!digit && styles.boxFilled, isActive && styles.boxActive]}>
            <Text style={styles.digit}>{digit ?? ''}</Text>
            {isActive && !digit && <View style={styles.caret} />}
          </View>
        );
      })}
      <TextInput
        ref={input}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.hidden}
        caretHidden
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  box: {
    flex: 1,
    maxWidth: 56,
    height: 60,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFilled: { borderColor: 'rgba(255,138,0,0.6)' },
  boxActive: { borderWidth: 1, borderColor: colors.primary },
  digit: { fontFamily: 'RedHatDisplay_700Bold', fontSize: 24, color: colors.text },
  caret: { position: 'absolute', width: 2, height: 24, borderRadius: 1, backgroundColor: colors.primary },
  hidden: { position: 'absolute', width: 1, height: 1, opacity: 0 },
});
