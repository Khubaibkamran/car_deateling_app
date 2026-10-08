import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { AppleIcon, GoogleIcon } from './icons';

type Props = {
  /** Text between the two lines, e.g. "Or sign in with". */
  label: string;
  onApple?: () => void;
  onGoogle?: () => void;
};

// "Or sign up with" divider followed by the Apple and Google buttons.
export default function SocialAuth({ label, onApple, onGoogle }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>{label}</Text>
        <View style={styles.line} />
      </View>
      <View style={styles.buttons}>
        <Pressable
          onPress={onApple}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          accessibilityLabel="Continue with Apple"
        >
          <AppleIcon />
        </Pressable>
        <Pressable
          onPress={onGoogle}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          accessibilityLabel="Continue with Google"
        >
          <GoogleIcon />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 17 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { width: 70, height: StyleSheet.hairlineWidth, backgroundColor: colors.textSecondary },
  dividerText: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.textSecondary },
  buttons: { flexDirection: 'row', gap: 8 },
  button: {
    width: 56,
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.01)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.6, transform: [{ scale: 0.95 }] },
});
