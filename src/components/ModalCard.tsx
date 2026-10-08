import { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Easing, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

type Props = {
  visible: boolean;
  /** Called on the Android back button and when the backdrop is tapped (if `dismissOnBackdrop`). */
  onRequestClose?: () => void;
  dismissOnBackdrop?: boolean;
  children: ReactNode;
};

// Dimmed backdrop with a card that scales in; stays mounted while it animates out.
export default function ModalCard({ visible, onRequestClose, dismissOnBackdrop = false, children }: Props) {
  const [mounted, setMounted] = useState(visible);
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(enter, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    } else {
      Animated.timing(enter, { toValue: 0, duration: 180, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, enter]);

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent onRequestClose={onRequestClose}>
      <Animated.View style={[styles.backdrop, { opacity: enter }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismissOnBackdrop ? onRequestClose : undefined} />
      </Animated.View>
      <KeyboardAvoidingView style={styles.host} behavior={Platform.OS === 'ios' ? 'padding' : undefined} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.card,
            { opacity: enter, transform: [{ scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] },
          ]}
        >
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)' },
  host: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 34 },
  card: {
    width: '100%',
    maxWidth: 362,
    borderRadius: 20,
    backgroundColor: colors.background,
    padding: 24,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
});
