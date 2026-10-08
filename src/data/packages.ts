import { ImageSourcePropType } from 'react-native';

export type Plan = {
  id: string;
  /** Pill label on the card. */
  tag: string;
  price: number;
  duration: string;
  description: string;
};

export type ServicePackage = {
  id: string;
  name: string;
  rating: number;
  description: string;
  image: ImageSourcePropType;
  plans: Plan[];
};

// Sample catalogue from the design. Replace with data from the backend once it exists.
export const EXTERIOR_WASH: ServicePackage = {
  id: 'exterior-wash',
  name: 'Exterior Wash & Shine',
  rating: 4.8,
  description:
    "Complete care, inside & out a thorough interior and exterior detail to restore your vehicle's shine",
  image: require('../../assets/images/booking/package.jpg'),
  plans: [
    {
      id: 'basic',
      tag: 'Basic Plan',
      price: 79,
      duration: '1.5 hours',
      description: 'Essential exterior & interior cleaning for a fresh, polished finish.',
    },
    {
      id: 'premium',
      tag: 'Premium Plan',
      price: 129,
      duration: '2 - 3 hours',
      description: 'Deep interior and exterior cleaning for a fresher, more polished look.',
    },
    {
      id: 'premium-plus',
      tag: 'Premium Plan',
      price: 199,
      duration: '4 - 5 hours',
      description: 'Advanced detailing with a premium finish for a truly refreshed vehicle.',
    },
  ],
};
