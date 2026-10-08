import { ComponentType, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BellRingIcon, BookingsIcon, TagIcon } from '../../components/drawerIcons';
import FadeIn from '../../components/FadeIn';
import { StepCarIcon } from '../../components/bookingIcons';
import { StepPaymentFilledIcon, TickCircleIcon } from '../../components/flowIcons';
import ScreenHeader from '../../components/ScreenHeader';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { AppNotification, NotificationType } from '../../data/notifications';

type Props = {
  notifications: AppNotification[];
  onBack?: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
};

type IconComponent = ComponentType<{ color?: string; size?: number }>;

const ICONS: Record<NotificationType, IconComponent> = {
  booking: BookingsIcon,
  onTheWay: ({ color = colors.primary }) => <StepCarIcon color={color} size={22} />,
  completed: ({ color = colors.primary }) => <TickCircleIcon size={22} color={color} />,
  payment: ({ color = colors.primary }) => <StepPaymentFilledIcon color={color} size={22} />,
  promo: TagIcon,
  job: BellRingIcon,
  reminder: BellRingIcon,
};

function Row({ item, onPress }: { item: AppNotification; onPress: () => void }) {
  const Icon = ICONS[item.type];
  const press = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(press, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 5 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={() => to(0.98)} onPressOut={() => to(1)} accessibilityLabel={item.title}>
      <Animated.View style={[styles.row, !item.read && styles.rowUnread, { transform: [{ scale: press }] }]}>
        <View style={styles.icon}>
          <Icon color={colors.primary} size={22} />
        </View>
        <View style={styles.text}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, item.read && styles.titleRead]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <Text style={styles.body} numberOfLines={3}>
            {item.body}
          </Text>
        </View>
        {!item.read && <View style={styles.dot} />}
      </Animated.View>
    </Pressable>
  );
}

// Everything the app has told you, newest first. Tap one to mark it read.
export default function NotificationsScreen({ notifications, onBack, onMarkRead, onMarkAllRead }: Props) {
  const unread = notifications.filter((n) => !n.read).length;
  const groups = (['Today', 'Earlier'] as const)
    .map((g) => ({ name: g, items: notifications.filter((n) => n.group === g) }))
    .filter((g) => g.items.length > 0);

  let index = 0;

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title="Notifications" onBack={onBack} font="redhat" />
      </FadeIn>

      <FadeIn delay={150} style={styles.bar}>
        <Text style={styles.summary}>{unread > 0 ? `${unread} unread` : 'All caught up'}</Text>
        {unread > 0 && (
          <Pressable onPress={onMarkAllRead} hitSlop={10}>
            <Text style={styles.markAll}>Mark all as read</Text>
          </Pressable>
        )}
      </FadeIn>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {groups.length === 0 ? (
          <FadeIn delay={250} style={styles.empty}>
            <BellRingIcon size={40} color={colors.border} />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyText}>We’ll let you know when something happens.</Text>
          </FadeIn>
        ) : (
          groups.map((g) => (
            <View key={g.name} style={styles.group}>
              <Text style={styles.groupTitle}>{g.name}</Text>
              {g.items.map((item) => (
                <FadeIn key={item.id} delay={250 + index++ * 70} distance={20}>
                  <Row item={item} onPress={() => onMarkRead(item.id)} />
                </FadeIn>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  bar: { marginTop: 24, marginHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summary: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.textSecondary },
  markAll: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.primary },
  scroll: { flex: 1, marginTop: 16 },
  content: { paddingHorizontal: 24, paddingBottom: 40, gap: 24 },
  group: { gap: 12 },
  groupTitle: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 16, letterSpacing: 0.3, color: colors.white },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowUnread: { borderColor: 'rgba(255,138,0,0.55)', backgroundColor: 'rgba(255,138,0,0.04)' },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#fff',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  text: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1, fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: colors.text },
  titleRead: { fontFamily: 'Poppins_500Medium', color: colors.textSecondary },
  time: { fontFamily: 'Poppins_400Regular', fontSize: 10, color: colors.textSecondary },
  body: { fontFamily: 'Poppins_400Regular', fontSize: 12, lineHeight: 18, color: colors.textSecondary },
  dot: { position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  empty: { alignItems: 'center', gap: 6, paddingTop: 80 },
  emptyTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: colors.text, marginTop: 8 },
  emptyText: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
});
