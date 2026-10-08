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

const DESCRIPTION = 'Offer high quality wash to give your car a showroom shine';

// Sample catalogue copied from the design. Replace with data from the backend once it exists.
export const SERVICES: ServiceItem[] = [
  {
    id: 'exterior-wash',
    name: 'Exterior Wash & Shine',
    description: DESCRIPTION,
    from: 29,
    rating: 4.8,
    category: 'Exterior',
    image: require('../../assets/images/services/s1.jpg'),
  },
  {
    id: 'ceramic-coating',
    name: 'Ceramic Coating',
    description: DESCRIPTION,
    from: 29,
    rating: 4.8,
    category: 'Ceramic',
    image: require('../../assets/images/services/s2.jpg'),
  },
  {
    id: 'premium-detail',
    name: 'Premium Detail',
    description: DESCRIPTION,
    from: 29,
    rating: 4.8,
    category: 'Polish',
    image: require('../../assets/images/services/s3.jpg'),
  },
  {
    id: 'interior-deep-clean',
    name: 'Interior Deep Clean',
    description: DESCRIPTION,
    from: 29,
    rating: 4.8,
    category: 'Interior',
    image: require('../../assets/images/services/s4.jpg'),
  },
  {
    id: 'paint-correction',
    name: 'Paint Correction',
    description: DESCRIPTION,
    from: 29,
    rating: 4.8,
    category: 'Polish',
    image: require('../../assets/images/services/s5.jpg'),
  },
];
