import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

type Props = {
  loading?: boolean;
  error?: string;
  /** Shown instead of the spinner when there's nothing to show yet. */
  onRetry?: () => void;
};

/** A spinner while loading, or the error with a "Try again" link. Renders nothing when neither applies. */
export default function StateView({ loading, error, onRetry }: Props) {
  if (!loading && !error) return null;
  return (
    <View style={styles.wrap}>
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <>
          <Text style={styles.error}>{error}</Text>
          {onRetry && (
            <Pressable onPress={onRetry} hitSlop={10}>
              <Text style={styles.retry}>Try again</Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 10, paddingVertical: 40, paddingHorizontal: 24 },
  error: { fontFamily: 'Poppins_500Medium', fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  retry: { fontFamily: 'Poppins_500Medium', fontSize: 13, color: colors.primary },
});
