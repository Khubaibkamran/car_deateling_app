import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { CheckIcon, ChevronDownIcon } from './icons';

type Props = {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
  /** Heading shown at the top of the sheet. */
  title: string;
  error?: boolean;
};

const SHEET_MAX = 420;

export default function SelectField({ value, placeholder, options, onChange, title, error = false }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sheet = useRef(new Animated.Value(0)).current;
  const chevron = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) setMounted(true);
    Animated.timing(sheet, {
      toValue: open ? 1 : 0,
      duration: open ? 280 : 200,
      easing: open ? Easing.out(Easing.cubic) : Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !open) setMounted(false);
    });
    Animated.timing(chevron, { toValue: open ? 1 : 0, duration: 220, useNativeDriver: true }).start();
  }, [open, sheet, chevron]);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.box, { borderColor: open ? colors.primary : error ? colors.red : colors.border }]}
        accessibilityRole="button"
      >
        <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Animated.View
          style={{
            transform: [{ rotate: chevron.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }],
          }}
        >
          <ChevronDownIcon />
        </Animated.View>
      </Pressable>

      <Modal visible={mounted} transparent animationType="none" onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <Animated.View style={[styles.backdrop, { opacity: sheet }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
        </Animated.View>
        <View style={styles.sheetHost} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.sheet,
              { transform: [{ translateY: sheet.interpolate({ inputRange: [0, 1], outputRange: [SHEET_MAX, 0] }) }] },
            ]}
          >
            <View style={styles.grabber} />
            <Text style={styles.sheetTitle}>{title}</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
              {options.map((option) => {
                const selected = option === value;
                return (
                  <Pressable
                    key={option}
                    style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                    onPress={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.optionText, selected && styles.optionSelected]}>{option}</Text>
                    {selected && <CheckIcon color={colors.primary} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 56,
    borderRadius: 12,
    borderWidth: 0.5,
    paddingLeft: 19,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: { flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.text },
  placeholder: { color: colors.textSecondary },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheetHost: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    maxHeight: SHEET_MAX,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: 16 },
  sheetTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: colors.text, marginBottom: 8 },
  list: { flexGrow: 0 },
  option: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionPressed: { opacity: 0.6 },
  optionText: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.textSecondary },
  optionSelected: { color: colors.primary },
});
