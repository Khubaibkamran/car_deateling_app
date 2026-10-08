import OnboardingSlide from './OnboardingSlide';

type Props = { onNext?: () => void };

export default function OnboardingScreen1({ onNext }: Props) {
  return (
    <OnboardingSlide
      image={require('../../../assets/images/onboarding/onboarding-1.png')}
      title="Book Your Detail, On Your Time, Your Terms!"
      description="Choose your vehicle, select the perfect service, and schedule professional detailing whenever it works best for you."
      onNext={onNext}
    />
  );
}
