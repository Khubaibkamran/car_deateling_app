import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SendIcon } from '../../components/drawerIcons';
import FadeIn from '../../components/FadeIn';
import ScreenHeader from '../../components/ScreenHeader';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { Conversation } from '../../data/messages';
import { Avatar } from './MessagesScreen';

type Props = {
  conversation: Conversation;
  onBack?: () => void;
  onSend: (text: string) => void;
};

// One conversation: your messages on the right in orange, the customer's on the left.
export default function ChatScreen({ conversation, onBack, onSend }: Props) {
  const [draft, setDraft] = useState('');
  const scroll = useRef<ScrollView>(null);

  // Keep the newest message in view.
  useEffect(() => {
    const id = setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(id);
  }, [conversation.messages.length]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft('');
  };

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title={conversation.name} onBack={onBack} font="redhat" />
      </FadeIn>
      <FadeIn delay={120} style={styles.who}>
        <Avatar conversation={conversation} size={36} />
        <Text style={styles.service} numberOfLines={1}>
          {conversation.subtitle}
        </Text>
      </FadeIn>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scroll}
          style={styles.flex}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {conversation.messages.map((m) => {
            const mine = m.from === 'me';
            return (
              <View key={m.id} style={[styles.line, mine ? styles.lineMine : styles.lineTheirs]}>
                <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                  <Text style={styles.text}>{m.text}</Text>
                </View>
                <Text style={styles.time}>{m.time}</Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message"
            placeholderTextColor={colors.textSecondary}
            selectionColor={colors.primary}
            style={styles.input}
            multiline
            maxLength={1000}
            onSubmitEditing={send}
          />
          <Pressable
            onPress={send}
            disabled={!draft.trim()}
            style={({ pressed }) => [styles.send, !draft.trim() && styles.sendOff, pressed && styles.sendPressed]}
            accessibilityLabel="Send message"
          >
            <SendIcon />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  flex: { flex: 1 },
  who: { marginTop: 16, marginHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 10 },
  service: { flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.primary },
  messages: { paddingHorizontal: 24, paddingVertical: 16, gap: 12 },
  line: { maxWidth: '80%', gap: 4 },
  lineMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  lineTheirs: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  bubbleMine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border },
  text: { fontFamily: 'Poppins_400Regular', fontSize: 13, lineHeight: 19, color: colors.text },
  time: { fontFamily: 'Poppins_400Regular', fontSize: 10, color: colors.textSecondary },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    maxHeight: 110,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: colors.border,
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  send: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  sendOff: { opacity: 0.35 },
  sendPressed: { transform: [{ scale: 0.92 }] },
});
