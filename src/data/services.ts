import { ImageSourcePropType } from 'react-native';

export const SERVICE_CATEGORIES = [
  'All Services',
  'Exterior',
  'Interior',
  'Polish',
  'Ceramic',
  'Protection',
  'Wheels',
  'Specialty',
] as const;

export type ServiceCategory = Exclude<(typeof SERVICE_CATEGORIES)[number], 'All Services'>;

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  /** Starting price in dollars. */
  from: number;
  rating: number;
  category: ServiceCategory;
  image: ImageSourcePropType;
};
