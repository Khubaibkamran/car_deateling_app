import OnboardingSlide from './OnboardingSlide';

type Props = { onNext?: () => void; onBack?: () => void };

export default function OnboardingScreen2({ onNext, onBack }: Props) {
  return (
    <OnboardingSlide
      image={require('../../../assets/images/onboarding/onboarding-2.png')}
      title="We Come To You, Wherever You Need Us."
      description="Enjoy expert car care at your preferred location while our trusted professionals take care of the rest."
      nextLabel="Continue"
      gradientEnd={0.66524}
      gradientOpacity={0.8}
      tracking
      onNext={onNext}
      onBack={onBack}
    />
  );
}
