export type UserProfile = {
  /** The account's id on the server (empty before sign-in). */
  id?: number;
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
  /** Technicians only, set by the server. */
  employeeCode?: string;
  rating?: number;
  ratingCount?: number;
  jobsCompleted?: number;
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
