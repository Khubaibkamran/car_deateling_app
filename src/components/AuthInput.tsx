import { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, TextInput, TextInputProps } from 'react-native';
import { colors } from '../constants/theme';
import { EyeIcon } from './icons';

type Props = Omit<TextInputProps, 'style'> & {
  icon?: ReactNode;
  /** Adds the show/hide eye on the right and hides the text until toggled. */
  password?: boolean;
  /** Italic suffix shown after the placeholder, e.g. "(e.g. BMW)". */
  hint?: string;
  /** Tall, top-aligned box for free-text notes. */
  multiline?: boolean;
  error?: boolean;
};

export default function AuthInput({
  icon,
  password = false,
  hint,
  multiline = false,
  error = false,
  placeholder,
  value,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const [hidden, setHidden] = useState(password);
  const [focused, setFocused] = useState(false);
  const focus = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focus, {
      toValue: focused ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [focused, focus]);

  const idle = error ? colors.red : colors.border;
  // A hint needs mixed styling, which a native placeholder can't do, so draw it ourselves.
  const customPlaceholder = !!hint && !value;

  return (
    <Animated.View
      style={[
        styles.box,
        multiline && styles.boxTall,
        {
          borderColor: focus.interpolate({ inputRange: [0, 1], outputRange: [idle, colors.primary] }),
          borderWidth: focus.interpolate({ inputRange: [0, 1], outputRange: [error ? 1 : 0.5, 1] }),
        },
      ]}
    >
      {icon}
      <TextInput
        {...rest}
        value={value}
        multiline={multiline}
        style={[styles.input, multiline && styles.inputTall]}
        placeholder={hint ? undefined : placeholder}
        placeholderTextColor={colors.textSecondary}
        selectionColor={colors.primary}
        secureTextEntry={hidden}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
      />
      {customPlaceholder && (
        <Text pointerEvents="none" style={[styles.placeholder, icon ? { left: 59 } : null, multiline && styles.placeholderTall]}>
          {placeholder} <Text style={styles.hint}>{hint}</Text>
        </Text>
      )}
      {password && (
        <Pressable onPress={() => setHidden((h) => !h)} hitSlop={12}>
          <EyeIcon visible={!hidden} />
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 19,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  boxTall: { height: 100, alignItems: 'flex-start', paddingTop: 19 },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: colors.text,
    padding: 0,
  },
  inputTall: { textAlignVertical: 'top' },
  placeholder: {
    position: 'absolute',
    left: 19,
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  placeholderTall: { top: 19 },
  hint: { fontFamily: 'Poppins_400Regular_Italic', fontSize: 12 },
});
