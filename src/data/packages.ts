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
