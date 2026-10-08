import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/theme';
import { LogoutIcon } from './drawerIcons';

type Props = { onPress: () => void };

// Dark rounded card with a white exit icon and "Logout", as in the Logout design.
export default function LogoutButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="Logout"
    >
      <LogoutIcon />
      <Text style={styles.label}>Logout</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    height: 56,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  label: { fontFamily: 'Poppins_500Medium', fontSize: 16, color: colors.text },
});
