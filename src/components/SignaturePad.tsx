import { useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../constants/theme';
import { RefreshIcon } from './extraIcons';

type Props = {
  /** Reports whether anything has been drawn. */
  onChange?: (hasSignature: boolean) => void;
  /** Called when a stroke starts/ends so a parent scroll view can pause while drawing. */
  onDrawingChange?: (drawing: boolean) => void;
  height?: number;
};

type Point = { x: number; y: number };

// Turns points into a smooth SVG path (midpoint quadratic curves).
function toPath(points: Point[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) {
    const { x, y } = points[0];
    return `M ${x} ${y} L ${x + 0.1} ${y + 0.1}`;
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const mid = { x: (points[i].x + points[i + 1].x) / 2, y: (points[i].y + points[i + 1].y) / 2 };
    d += ` Q ${points[i].x} ${points[i].y} ${mid.x} ${mid.y}`;
  }
  const last = points[points.length - 1];
  return `${d} L ${last.x} ${last.y}`;
}

// A box you can sign in with your finger.
export default function SignaturePad({ onChange, onDrawingChange, height = 88 }: Props) {
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const live = useRef<Point[]>([]);
  const notify = useRef({ onChange, onDrawingChange });
  notify.current = { onChange, onDrawingChange };

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e) => {
          live.current = [{ x: e.nativeEvent.locationX, y: e.nativeEvent.locationY }];
          notify.current.onDrawingChange?.(true);
          setStrokes((s) => [...s, live.current]);
        },
        onPanResponderMove: (e) => {
          live.current = [...live.current, { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY }];
          const stroke = live.current;
          setStrokes((s) => [...s.slice(0, -1), stroke]);
        },
        onPanResponderRelease: () => {
          notify.current.onDrawingChange?.(false);
          notify.current.onChange?.(true);
        },
        onPanResponderTerminate: () => notify.current.onDrawingChange?.(false),
      }),
    [],
  );

  const clear = () => {
    setStrokes([]);
    live.current = [];
    onChange?.(false);
  };

  return (
    <View style={[styles.box, { height }]}>
      <View style={StyleSheet.absoluteFill} {...responder.panHandlers}>
        <Svg width="100%" height="100%">
          {strokes.map((stroke, i) => (
            <Path key={i} d={toPath(stroke)} stroke={colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          ))}
        </Svg>
        {strokes.length === 0 && (
          <View pointerEvents="none" style={styles.hintWrap}>
            <Text style={styles.hint}>Sign here</Text>
          </View>
        )}
      </View>
      {strokes.length > 0 && (
        <Pressable style={styles.clear} onPress={clear} hitSlop={10} accessibilityLabel="Clear signature">
          <RefreshIcon />
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 12,
    backgroundColor: colors.background,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#fff',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  hintWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  hint: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.border },
  clear: { position: 'absolute', right: 12, bottom: 8, flexDirection: 'row', alignItems: 'center', gap: 2 },
  clearText: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.blue },
});
