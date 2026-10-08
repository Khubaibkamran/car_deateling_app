import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import ModalCard from './ModalCard';
import PrimaryButton from './PrimaryButton';

type Button = { text?: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void };
type Dialog = { title: string; message?: string; buttons: Button[]; cancelable: boolean; onDismiss?: () => void };

// A drop-in for React Native's Alert, drawn in the app's own style instead of the system's white box.
let show: ((dialog: Dialog) => void) | undefined;
const waiting: Dialog[] = [];

export const Alert = {
  alert(title: string, message?: string, buttons?: Button[], options?: { cancelable?: boolean; onDismiss?: () => void }) {
    const dialog: Dialog = {
      title,
      message,
      buttons: buttons?.length ? buttons : [{ text: 'OK' }],
      cancelable: options?.cancelable ?? true,
      onDismiss: options?.onDismiss,
    };
    if (show) show(dialog);
    else waiting.push(dialog);
  },
};

/** Mount once near the top of the app: it draws whatever `Alert.alert` is asked to show. */
export function AlertHost() {
  const [queue, setQueue] = useState<Dialog[]>([]);

  useEffect(() => {
    show = (dialog) => setQueue((q) => [...q, dialog]);
    waiting.splice(0).forEach((d) => show?.(d));
    return () => {
      show = undefined;
    };
  }, []);

  const current = queue[0];
  const close = (button?: Button) => {
    setQueue((q) => q.slice(1));
    // Let the dialog start closing before whatever the button does (it may open another one).
    const after = button ? button.onPress : current?.onDismiss;
    if (after) setTimeout(after, 0);
  };
  const cancelButton = current?.buttons.find((b) => b.style === 'cancel');

  // Cancel is the quiet outline button; the first other button is the highlighted one.
  const firstAction = current?.buttons.findIndex((b) => b.style !== 'cancel') ?? -1;
  const stacked = (current?.buttons.length ?? 0) > 2;

  return (
    <ModalCard
      visible={!!current}
      onRequestClose={() => current?.cancelable && close(cancelButton)}
      dismissOnBackdrop={current?.cancelable}
    >
      <Text style={styles.title}>{current?.title}</Text>
      {!!current?.message && <Text style={styles.message}>{current.message}</Text>}
      <View style={[styles.actions, stacked && styles.stacked]}>
        {current?.buttons.map((b, i) => (
          <View key={`${b.text}-${i}`} style={stacked ? undefined : styles.button}>
            <PrimaryButton
              title={b.text ?? 'OK'}
              variant={b.style === 'cancel' || (i !== firstAction && current.buttons.length > 1) ? 'outline' : 'solid'}
              onPress={() => close(b)}
            />
          </View>
        ))}
      </View>
    </ModalCard>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, color: colors.text, textAlign: 'center' },
  message: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  stacked: { flexDirection: 'column', gap: 10 },
  button: { flex: 1 },
});
