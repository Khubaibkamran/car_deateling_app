import { ComponentType, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../constants/theme';
import { WalletTabIcon } from './extraIcons';
import { BoxTabIcon, CarTabIcon, HomeTabIcon, MessageTabIcon, UserTabIcon } from './homeIcons';

export type TabKey = 'home' | 'vehicles' | 'services' | 'messages' | 'profile' | 'jobs' | 'wallet';

export type Tab = { key: TabKey; Icon: ComponentType<{ color?: string }>; centerX: number };

// Icon centres taken from the 430px-wide Figma frame.
export const CUSTOMER_TABS: Tab[] = [
  { key: 'home', Icon: HomeTabIcon, centerX: 56 },
  { key: 'vehicles', Icon: CarTabIcon, centerX: 139 },
  { key: 'services', Icon: BoxTabIcon, centerX: 220 },
  { key: 'messages', Icon: MessageTabIcon, centerX: 302 },
  { key: 'profile', Icon: UserTabIcon, centerX: 383 },
];

// The technician app swaps the services tab for a wallet and calls the car tab "jobs".
export const TECHNICIAN_TABS: Tab[] = [
  { key: 'home', Icon: HomeTabIcon, centerX: 56 },
  { key: 'jobs', Icon: CarTabIcon, centerX: 139 },
  { key: 'wallet', Icon: WalletTabIcon, centerX: 220 },
  { key: 'messages', Icon: MessageTabIcon, centerX: 302 },
  { key: 'profile', Icon: UserTabIcon, centerX: 383 },
];

const HEIGHT = 100;
const NOTCH_W = 101.637;
const NOTCH_H = 45;
const BUBBLE_W = 56.6818;
const BUBBLE_H = 58;
const ICON = 30;
const LIFT = 28; // how far the active icon rises into the bubble

type Props = { active: TabKey; onChange: (tab: TabKey) => void; tabs?: Tab[] };

export default function BottomNavBar({ active, onChange, tabs: TABS = CUSTOMER_TABS }: Props) {
  const { width } = useWindowDimensions();
  const k = width / 430;
  const centers = TABS.map((t) => t.centerX * k);
  const index = TABS.findIndex((t) => t.key === active);

  const pos = useRef(new Animated.Value(index)).current;

  useEffect(() => {
    Animated.spring(pos, { toValue: index, speed: 14, bounciness: 9, useNativeDriver: true }).start();
  }, [index, pos]);

  const range = TABS.map((_, i) => i);
  const bubbleX = pos.interpolate({ inputRange: range, outputRange: centers });

  return (
    <View style={[styles.wrap, { width }]}>
      <View style={styles.bar} />

      {/* Scooped notch (page colour) and the white bubble follow the active tab. */}
      <Animated.View style={[styles.notch, { transform: [{ translateX: bubbleX }, { translateX: -NOTCH_W / 2 }] }]}>
        <Svg width={NOTCH_W} height={NOTCH_H} viewBox="0 0 101.637 45" fill="none">
          <Path
            d="M101.637 0C82.4388 0 93.3295 44.9999 50.8184 45C8.30699 45 19.7626 0 0 0H101.637Z"
            fill={colors.background}
          />
        </Svg>
      </Animated.View>
      <Animated.View style={[styles.bubble, { transform: [{ translateX: bubbleX }, { translateX: -BUBBLE_W / 2 }] }]} />

      {TABS.map(({ key, Icon }, i) => {
        const activeness = pos.interpolate({
          inputRange: [i - 1, i, i + 1],
          outputRange: [0, 1, 0],
          extrapolate: 'clamp',
        });
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            hitSlop={8}
            accessibilityRole="tab"
            accessibilityState={{ selected: key === active }}
            style={[styles.tab, { left: centers[i] - ICON / 2 }]}
          >
            <Animated.View
              style={{
                transform: [{ translateY: activeness.interpolate({ inputRange: [0, 1], outputRange: [0, -LIFT] }) }],
              }}
            >
              <Icon color={colors.textSecondary} />
              <Animated.View style={[StyleSheet.absoluteFill, { opacity: activeness }]}>
                <Icon color={colors.primary} />
              </Animated.View>
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', bottom: 0, left: 0, height: HEIGHT },
  bar: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#161B20',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  notch: { position: 'absolute', top: 20, left: 0 },
  bubble: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: BUBBLE_W,
    height: BUBBLE_H,
    borderRadius: BUBBLE_H / 2,
    backgroundColor: colors.text,
  },
  tab: { position: 'absolute', top: 42, width: ICON, height: ICON },
});
