import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { SuccessBadge } from '../../components/flowIcons';
import { CloseIcon } from '../../components/jobIcons';
import ModalCard from '../../components/ModalCard';
import PrimaryButton from '../../components/PrimaryButton';
import SignaturePad from '../../components/SignaturePad';
import { colors } from '../../constants/theme';

/** The orange badge, popping in with a slight twist each time the modal opens. */
function PoppingBadge({ visible }: { visible: boolean }) {
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      pop.setValue(0);
      return;
    }
    Animated.spring(pop, { toValue: 1, speed: 8, bounciness: 14, delay: 150, useNativeDriver: true }).start();
  }, [visible, pop]);

  return (
    <Animated.View
      style={[
        styles.badge,
        {
          opacity: pop,
          transform: [
            { scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
            { rotate: pop.interpolate({ inputRange: [0, 1], outputRange: ['-25deg', '0deg'] }) },
          ],
        },
      ]}
    >
      <SuccessBadge size={110} />
    </Animated.View>
  );
}

type SignatureProps = {
  visible: boolean;
  onClose: () => void;
  /** Called once the customer has signed and the technician confirms. */
  onComplete: () => void;
};

// The customer signs on the technician's phone to confirm the work is finished.
export function SignatureModal({ visible, onClose, onComplete }: SignatureProps) {
  const [signed, setSigned] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSigned(false);
      setShowError(false);
    }
  }, [visible]);

  const submit = () => {
    if (!signed) {
      setShowError(true);
      return;
    }
    onComplete();
  };

  return (
    <ModalCard visible={visible} onRequestClose={onClose}>
      <PoppingBadge visible={visible} />
      <Text style={styles.title}>Service Completion</Text>
      <Text style={styles.subtitle}>Ask the customer to sign below to confirm the service is complete</Text>
      <View style={styles.pad}>
        <SignaturePad
          height={120}
          onChange={(has) => {
            setSigned(has);
            if (has) setShowError(false);
          }}
        />
      </View>
      {showError && <Text style={styles.error}>The customer needs to sign before you can complete the service.</Text>}
      <View style={styles.action}>
        <PrimaryButton title="Complete Service" onPress={submit} />
      </View>
    </ModalCard>
  );
}

type CompletedProps = { visible: boolean; onClose: () => void };

export function JobCompletedModal({ visible, onClose }: CompletedProps) {
  return (
    <ModalCard visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.close} onPress={onClose} hitSlop={12} accessibilityLabel="Close">
        <CloseIcon size={14} />
      </Pressable>
      <PoppingBadge visible={visible} />
      <Text style={styles.title}>Service Completed!</Text>
      <Text style={styles.subtitle}>
        The job has been successfully completed and the customer signature has been recorded.
      </Text>
    </ModalCard>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'center', marginTop: -10, marginBottom: -14 },
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, color: colors.text, textAlign: 'center' },
  subtitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 8,
  },
  pad: { marginTop: 20 },
  error: { fontFamily: 'Poppins_500Medium', fontSize: 11, color: colors.red, textAlign: 'center', marginTop: 10 },
  action: { marginTop: 16 },
  close: { position: 'absolute', top: 16, right: 16, zIndex: 2 },
});
