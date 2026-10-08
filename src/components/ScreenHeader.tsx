import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { BackIcon } from './icons';

type Props = { title: string; onBack?: () => void; font?: 'poppins' | 'redhat' };

// Back arrow on the left with a centred title; sits 50px from the top like the design.
export default function ScreenHeader({ title, onBack, font = 'poppins' }: Props) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onBack} hitSlop={14} style={styles.back} accessibilityLabel="Go back">
        <BackIcon />
      </Pressable>
      <Text style={[styles.title, font === 'redhat' && styles.redhat]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginTop: 50, height: 24, justifyContent: 'center', alignItems: 'center' },
  back: { position: 'absolute', left: 24 },
  title: { fontFamily: 'Poppins_500Medium', fontSize: 16, letterSpacing: 0.32, color: colors.white },
  redhat: { fontFamily: 'RedHatDisplay_500Medium' },
});
