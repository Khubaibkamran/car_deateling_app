import { ReactNode } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../constants/theme';

const tire = require('../../assets/images/splash/tire-bg.png');

type Props = {
  children: ReactNode;
  /** Faint tyre print in the corner, as on the summary cards. */
  tire?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Dark rounded card with a soft white glow, used for grouped details across the app.
export default function GlowCard({ children, tire: showTire, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      {showTire && <Image source={tire} style={styles.tire} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.background,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  tire: { position: 'absolute', right: 0, top: -60, width: 231, height: 231, opacity: 0.1 },
});
