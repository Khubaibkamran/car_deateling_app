import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';
import BookingStepper from './BookingStepper';
import FadeIn from './FadeIn';
import ScreenHeader from './ScreenHeader';
import TireBackground from './TireBackground';

type Props = {
  step: 0 | 1 | 2 | 3 | 4;
  onBack?: () => void;
  children: ReactNode;
};

// Shared frame for the booking screens: tyre background, "Book a Service" header and the step indicator.
export default function BookingLayout({ step, onBack, children }: Props) {
  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title="Book a Service" onBack={onBack} font="redhat" />
      </FadeIn>
      <FadeIn delay={150} style={styles.stepper}>
        <BookingStepper current={step} />
      </FadeIn>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  stepper: { marginTop: 40 },
});
