import { ImageSourcePropType } from 'react-native';

export type Vehicle = {
  id: string;
  name: string;
  year: string;
  color: string;
  plate: string;
  notes?: string;
  /** Photo for the card; vehicles added in the app have none yet. */
  image?: ImageSourcePropType;
  imageBox?: { left: number; top: number; width: number; height: number };
  /** Stretch the photo to the box instead of cropping it (the design does this for the Corolla). */
  stretch?: boolean;
};
