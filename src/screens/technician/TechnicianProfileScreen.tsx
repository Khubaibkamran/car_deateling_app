import {
  BellRingIcon,
  CardIcon,
  DocumentIcon,
  HelpIcon,
  SettingsIcon,
  ShieldIcon,
} from '../../components/drawerIcons';
import { UserTabIcon } from '../../components/homeIcons';
import ProfileScreen, { ProfileGroup } from '../profile/ProfileScreen';
import { UserProfile } from '../../types/profile';

type Props = {
  profile: UserProfile;
  onEditProfile: () => void;
  /** Opens a page that isn't built yet, by title. */
  onOpenPage: (title: string) => void;
  onLogout: () => void;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
  notifications?: number;
};

// The technician's account: who they are, their numbers, preferences and sign-out.
export default function TechnicianProfileScreen({ profile, onEditProfile, onOpenPage, onLogout, ...header }: Props) {
  const groups: ProfileGroup[] = [
    {
      title: 'Account',
      rows: [
        { key: 'edit', Icon: UserTabIcon, label: 'Edit Profile', onPress: onEditProfile },
        { key: 'docs', Icon: DocumentIcon, label: 'Documents & Licenses', onPress: () => onOpenPage('Documents & Licenses') },
        { key: 'bank', Icon: CardIcon, label: 'Bank & Payout Details', onPress: () => onOpenPage('Bank & Payout Details') },
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
      subtitle={`Technician · ${profile.specialty || 'ID 0145425'}`}
      stats={[
        { value: '4.8', label: 'Rating' },
        { value: '126', label: 'Jobs done' },
        { value: '98%', label: 'On time' },
      ]}
      groups={groups}
      onLogout={onLogout}
      {...header}
    />
  );
}
