import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import FadeIn from '../../components/FadeIn';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { Conversation } from '../../data/messages';

const NAV_HEIGHT = 100;

export function Avatar({ conversation, size = 48 }: { conversation: Conversation; size?: number }) {
  const radius = size / 3;
  if (conversation.photo) {
    return <Image source={conversation.photo} style={{ width: size, height: size, borderRadius: radius }} />;
  }
  return (
    <View style={[styles.initial, { width: size, height: size, borderRadius: radius }]}>
      <Text style={[styles.initialText, { fontSize: size * 0.42 }]}>{conversation.name.charAt(0)}</Text>
    </View>
  );
}

type Props = {
  conversations: Conversation[];
  /** Line under the title. */
  subtitle?: string;
  onOpen: (conversation: Conversation) => void;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
  notifications?: number;
};

// Chats with the customers you're working for, newest activity first as given.
export default function MessagesScreen({ conversations, subtitle = 'Talk to your customers about their jobs', onOpen, onMenuPress, onNotificationsPress, notifications }: Props) {
  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <AppHeader onMenuPress={onMenuPress} onNotificationsPress={onNotificationsPress} notifications={notifications} />

      <FadeIn delay={150} style={styles.heading}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </FadeIn>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {conversations.length === 0 ? (
          <FadeIn style={styles.empty}>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyText}>Conversations start when you book a service.</Text>
          </FadeIn>
        ) : (
          conversations.map((c, i) => {
            const last = c.messages[c.messages.length - 1];
            return (
              <FadeIn key={c.id} delay={250 + i * 70} distance={24}>
                <Pressable
                  onPress={() => onOpen(c)}
                  style={({ pressed }) => [styles.row, c.unread > 0 && styles.rowUnread, pressed && styles.pressed]}
                  accessibilityLabel={`Chat with ${c.name}`}
                >
                  <Avatar conversation={c} />
                  <View style={styles.text}>
                    <View style={styles.topLine}>
                      <Text style={styles.name} numberOfLines={1}>
                        {c.name}
                      </Text>
                      <Text style={styles.time}>{last?.time}</Text>
                    </View>
                    <Text style={styles.service} numberOfLines={1}>
                      {c.subtitle}
                    </Text>
                    <View style={styles.bottomLine}>
                      <Text style={[styles.preview, c.unread > 0 && styles.previewUnread]} numberOfLines={1}>
                        {last ? `${last.from === 'me' ? 'You: ' : ''}${last.text}` : 'No messages yet'}
                      </Text>
                      {c.unread > 0 && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{c.unread}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Pressable>
              </FadeIn>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  heading: { marginTop: 32, marginHorizontal: 24, gap: 4 },
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, letterSpacing: 0.36, color: colors.white },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.textSecondary },
  list: { flex: 1, marginTop: 16 },
  listContent: { paddingHorizontal: 24, paddingBottom: NAV_HEIGHT + 24, gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  rowUnread: { borderColor: 'rgba(255,138,0,0.55)', backgroundColor: 'rgba(255,138,0,0.04)' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  initial: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,138,0,0.15)', borderWidth: 1, borderColor: colors.primary },
  initialText: { fontFamily: 'RedHatDisplay_700Bold', color: colors.primary },
  text: { flex: 1, gap: 2 },
  topLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  name: { flex: 1, fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: colors.text },
  time: { fontFamily: 'Poppins_400Regular', fontSize: 10, color: colors.textSecondary },
  service: { fontFamily: 'Poppins_500Medium', fontSize: 11, color: colors.primary },
  bottomLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  preview: { flex: 1, fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
  previewUnread: { fontFamily: 'Poppins_500Medium', color: colors.text },
  badge: { minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  badgeText: { fontFamily: 'Poppins_600SemiBold', fontSize: 11, color: colors.white },
  empty: { alignItems: 'center', gap: 4, paddingTop: 60 },
  emptyTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: colors.text },
  emptyText: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
});
