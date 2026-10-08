import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, ImageSourcePropType, LayoutChangeEvent, PanResponder, StyleSheet, View } from 'react-native';
import { CompareHandle } from './extraIcons';

type Props = {
  before: ImageSourcePropType;
  after: ImageSourcePropType;
  /** Width / height of the source photos, used to bottom-align them like the design. */
  aspect: number;
  height?: number;
};

const HANDLE = 24;

// Drag the orange handle to reveal the "before" photo on the left and the "after" photo on the right.
export default function BeforeAfter({ before, after, aspect, height = 140 }: Props) {
  const [width, setWidth] = useState(0);
  // JS-driven on purpose: the revealed width can't use the native driver.
  const pos = useRef(new Animated.Value(0)).current;
  const current = useRef(0);
  const startAt = useRef(0);
  const widthRef = useRef(0);

  useEffect(() => {
    widthRef.current = width;
    if (!width) return;
    // Sweep from the left to the middle on first show so people notice it can be dragged.
    pos.setValue(0);
    current.current = width / 2;
    Animated.timing(pos, { toValue: width / 2, duration: 900, delay: 300, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [width, pos]);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false, // keep the gesture even inside a scroll view
        onPanResponderGrant: (e) => {
          pos.stopAnimation((v) => {
            startAt.current = v;
            current.current = v;
          });
          // A tap jumps the divider straight to the finger.
          const x = Math.min(widthRef.current, Math.max(0, e.nativeEvent.locationX));
          startAt.current = x;
          current.current = x;
          pos.setValue(x);
        },
        onPanResponderMove: (_, g) => {
          const x = Math.min(widthRef.current, Math.max(0, startAt.current + g.dx));
          current.current = x;
          pos.setValue(x);
        },
      }),
    [pos],
  );

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const photoStyle = { position: 'absolute' as const, bottom: 0, left: 0, width, height: width / aspect };

  return (
    <View style={[styles.box, { height }]} onLayout={onLayout} {...responder.panHandlers}>
      {width > 0 && (
        <>
          <Animated.Image source={after} style={photoStyle} resizeMode="cover" />
          <Animated.View style={[styles.beforeClip, { width: pos }]}>
            <Animated.Image source={before} style={photoStyle} resizeMode="cover" />
          </Animated.View>
          <Animated.View
            pointerEvents="none"
            style={[styles.handle, { height, transform: [{ translateX: Animated.subtract(pos, HANDLE / 2) }] }]}
          >
            <CompareHandle height={height} />
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: 12, overflow: 'hidden', backgroundColor: '#D9D9D9' },
  beforeClip: { position: 'absolute', top: 0, left: 0, bottom: 0, overflow: 'hidden' },
  handle: { position: 'absolute', top: 0, left: 0, width: HANDLE },
});
