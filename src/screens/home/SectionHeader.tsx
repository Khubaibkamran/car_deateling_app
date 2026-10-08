import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/theme';

type Props = { title: string; action?: ReactNode; actionLabel?: string; onActionPress?: () => void };

export default function SectionHeader({ title, action, actionLabel, onActionPress }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action ?? (
        actionLabel ? (
          <Pressable onPress={onActionPress} hitSlop={10}>
            <Text style={styles.action}>{actionLabel}</Text>
          </Pressable>
        ) : null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, letterSpacing: 0.36, color: colors.white },
  action: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.primary },
});
