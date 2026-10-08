import {
  BellRingIcon,
  BookingsIcon,
  CardIcon,
  HelpIcon,
  SettingsIcon,
  ShieldIcon,
} from '../../components/drawerIcons';
import { CarTabIcon, UserTabIcon } from '../../components/homeIcons';
import { UserProfile } from '../../types/profile';
import ProfileScreen, { ProfileGroup } from './ProfileScreen';

type Props = {
  profile: UserProfile;
  vehicleCount: number;
  bookingCount: number;
  reviewCount: number;
  onEditProfile: () => void;
  onOpenVehicles: () => void;
  /** Opens a page that isn't built yet, by title. */
  onOpenPage: (title: string) => void;
  onLogout: () => void;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
  notifications?: number;
};

// The customer's account: details, saved things, preferences and sign-out.
export default function CustomerProfileScreen({
  profile,
  vehicleCount,
  bookingCount,
  reviewCount,
  onEditProfile,
  onOpenVehicles,
  onOpenPage,
  onLogout,
  ...header
}: Props) {
  const groups: ProfileGroup[] = [
    {
      title: 'Account',
      rows: [
        { key: 'edit', Icon: UserTabIcon, label: 'Edit Profile', onPress: onEditProfile },
        { key: 'vehicles', Icon: CarTabIcon, label: 'My Vehicles', onPress: onOpenVehicles },
        { key: 'bookings', Icon: BookingsIcon, label: 'My Bookings', onPress: () => onOpenPage('My Bookings') },
        { key: 'payments', Icon: CardIcon, label: 'Payment Methods', onPress: () => onOpenPage('Payment Methods') },
      ],
    },
    {
      title: 'Preferences',
      rows: [
        { key: 'push', Icon: BellRingIcon, label: 'Push Notifications', toggle: true },
        { key: 'privacy', Icon: ShieldIcon, label: 'Privacy & Security', onPress: () => onOpenPage('Privacy & Security') },
        { key: 'settings', Icon: SettingsIcon, label: 'Settings', onPress: () => onOpenPage('Settings') },
      ],
    },
    {
      title: 'Support',
      rows: [{ key: 'help', Icon: HelpIcon, label: 'Help & Support', onPress: () => onOpenPage('Help & Support') }],
    },
  ];

  return (
    <ProfileScreen
      profile={profile}
      subtitle={profile.email || 'Customer'}
      stats={[
        { value: `${bookingCount}`, label: bookingCount === 1 ? 'Booking' : 'Bookings' },
        { value: `${vehicleCount}`, label: vehicleCount === 1 ? 'Vehicle' : 'Vehicles' },
        { value: `${reviewCount}`, label: reviewCount === 1 ? 'Review' : 'Reviews' },
      ]}
      groups={groups}
      onLogout={onLogout}
      {...header}
    />
  );
}
