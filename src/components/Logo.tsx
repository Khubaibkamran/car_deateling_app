import { Image, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Figma crops a 1024px sheet (two orange triangles) into a 90.722 x 80 box.
const BASE_W = 90.722;
const BASE_H = 80;

type Props = { width?: number };

export default function Logo({ width = BASE_W }: Props) {
  const s = width / BASE_W;
  const w = BASE_W * s;
  const h = BASE_H * s;

  return (
    <View style={{ width: w, height: h }}>
      <View style={{ width: w, height: h, overflow: 'hidden' }}>
        <Image
          source={require('../../assets/images/splash/logo.png')}
          style={{
            position: 'absolute',
            width: w * 1.8618,
            height: h * 2.1113,
            left: -w * 0.4182,
            top: -h * 0.4887,
          }}
        />
      </View>
      <Svg
        width={45.9444 * s}
        height={39.9175 * s}
        viewBox="0 0 45.9444 39.9175"
        style={[styles.white, { left: 48.83 * s }]}
      >
        <Path d="M23.1026 39.9175L45.9444 0H0L23.1026 39.9175Z" fill="#FFFFFF" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  white: { position: 'absolute', top: 0 },
});
