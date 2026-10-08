import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import FadeIn from './FadeIn';
import { BellIcon, MenuIcon } from './homeIcons';
import Logo from './Logo';
import Wordmark from './Wordmark';

type Props = {
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
  /** Unread notifications shown on the bell; hidden at 0. */
  notifications?: number;
};

// Menu, logo lockup and notification bell shared by the main tab screens (top: 50 in the design).
export default function AppHeader({ onMenuPress, onNotificationsPress, notifications = 5 }: Props) {
  return (
    <FadeIn delay={50} distance={-16} style={styles.header}>
      <Pressable onPress={onMenuPress} hitSlop={12} accessibilityLabel="Open menu">
        <MenuIcon />
      </Pressable>

      <View style={styles.brand}>
        <Logo width={35.155} />
        <View style={styles.brandWord}>
          <Wordmark width={89} />
        </View>
      </View>

      <Pressable onPress={onNotificationsPress} hitSlop={12} style={styles.bell} accessibilityLabel="Notifications">
        <View style={styles.bellIcon}>
          <BellIcon />
        </View>
        {notifications > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifications > 9 ? '9+' : notifications}</Text>
          </View>
        )}
      </Pressable>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    paddingHorizontal: 24,
    height: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { width: 139.14, height: 31 },
  brandWord: { position: 'absolute', left: 50.14, top: 7 },
  bell: { width: 24, height: 24 },
  bellIcon: { position: 'absolute', left: 3.74, top: 2.25 },
  badge: {
    position: 'absolute',
    top: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: 'Poppins_500Medium', fontSize: 6, lineHeight: 8, color: colors.white },
});
