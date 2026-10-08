import { ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors } from '../constants/theme';
import LogoutButton from './LogoutButton';
import Logo from './Logo';
import Wordmark from './Wordmark';

export type DrawerItem = {
  key: string;
  label: string;
  Icon: ComponentType<{ color?: string; size?: number }>;
  /** Small orange count on the right (e.g. unread notifications). */
  badge?: number;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: { name: string; subtitle: string; photo?: string };
  items: DrawerItem[];
  /** Highlights the item for the screen you're on. */
  activeKey?: string;
  onLogout: () => void;
};

const tire = require('../../assets/images/splash/tire-bg.png');

// Slide-in menu from the left. Tap the dimmed area, press back, or swipe left to close it.
export default function SideDrawer({ visible, onClose, profile, items, activeKey, onLogout }: Props) {
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(320, width * 0.82);

  const [mounted, setMounted] = useState(visible);
  const open = useRef(new Animated.Value(0)).current; // 0 closed .. 1 open
  const drag = useRef(new Animated.Value(0)).current; // negative while swiping it shut

  useEffect(() => {
    if (visible) {
      setMounted(true);
      drag.setValue(0);
      Animated.timing(open, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    } else {
      Animated.timing(open, { toValue: 0, duration: 220, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, open, drag]);

  const swipe = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => g.dx < -8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
        onPanResponderMove: (_, g) => drag.setValue(Math.min(0, g.dx)),
        onPanResponderRelease: (_, g) => {
          if (g.dx < -panelWidth / 3 || g.vx < -0.6) {
            onClose();
          } else {
            Animated.spring(drag, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 4 }).start();
          }
        },
        onPanResponderTerminate: () => Animated.spring(drag, { toValue: 0, useNativeDriver: true }).start(),
      }),
    [drag, onClose, panelWidth],
  );

  const translateX = Animated.add(open.interpolate({ inputRange: [0, 1], outputRange: [-panelWidth, 0] }), drag);
  const backdrop = Animated.multiply(open, drag.interpolate({ inputRange: [-panelWidth, 0], outputRange: [0, 1], extrapolate: 'clamp' }));

  // Close first so the menu is out of the way, then run the action.
  const choose = (action: () => void) => () => {
    onClose();
    action();
  };

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close menu" />
      </Animated.View>

      <Animated.View style={[styles.panel, { width: panelWidth, transform: [{ translateX }] }]} {...swipe.panHandlers}>
        <Image source={tire} style={styles.tire} />

        <View style={styles.brand}>
          <Logo width={35.155} />
          <Wordmark width={89} />
        </View>

        <View style={styles.profile}>
          <View style={styles.avatar}>
            {profile.photo ? (
              <Image source={{ uri: profile.photo }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{profile.name.trim().charAt(0).toUpperCase() || '?'}</Text>
            )}
          </View>
          <View style={styles.profileText}>
            <Text style={styles.name} numberOfLines={1}>
              {profile.name}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {profile.subtitle}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {items.map(({ key, label, Icon, badge, onPress }) => {
            const active = key === activeKey;
            return (
              <Pressable
                key={key}
                onPress={choose(onPress)}
                style={({ pressed }) => [styles.item, active && styles.itemActive, pressed && styles.itemPressed]}
                accessibilityRole="menuitem"
              >
                <Icon color={active ? colors.primary : colors.textSecondary} />
                <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
                {!!badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <LogoutButton onPress={choose(onLogout)} />
          <Text style={styles.version}>Volvo · v1.0.0</Text>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)' },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.surface,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 56,
    overflow: 'hidden',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  tire: { position: 'absolute', right: -90, bottom: -60, width: 320, height: 320, opacity: 0.06, transform: [{ rotate: '-45deg' }] },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24 },
  profile: {
    marginTop: 28,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,138,0,0.15)',
    borderWidth: 1,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { fontFamily: 'RedHatDisplay_700Bold', fontSize: 20, color: colors.primary },
  profileText: { flex: 1, gap: 2 },
  name: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: colors.text },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
  list: { flex: 1, marginTop: 12 },
  listContent: { paddingHorizontal: 12, paddingBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, height: 48, paddingHorizontal: 14, borderRadius: 10 },
  itemActive: { backgroundColor: 'rgba(255,138,0,0.12)' },
  itemPressed: { backgroundColor: 'rgba(255,255,255,0.06)' },
  label: { flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.text },
  labelActive: { color: colors.primary },
  badge: { minWidth: 22, height: 20, borderRadius: 10, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  badgeText: { fontFamily: 'Poppins_600SemiBold', fontSize: 11, color: colors.white },
  footer: { paddingHorizontal: 12, paddingBottom: 28, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  version: { fontFamily: 'Poppins_400Regular', fontSize: 11, color: colors.border, textAlign: 'center', marginTop: 10 },
});
