export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  city: string;
  /** Technicians only. */
  specialty: string;
  /** Technicians only. */
  experience: string;
  bio: string;
  /** Local file URI of the chosen photo; the initial letter is shown when missing. */
  photo?: string;
};

export const EMPTY_PROFILE: UserProfile = {
  name: 'Guest',
  email: '',
  phone: '',
  city: '',
  specialty: '',
  experience: '',
  bio: '',
};
