import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Logo from './Logo';
import Wordmark from './Wordmark';

// Small logo + wordmark lockup used at the top of the auth screens (top: 50 in the design).
export default function BrandHeader() {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.row, { left: width * 0.2 + 59.65 }]}>
      <Logo width={35.155} />
      <Wordmark width={width * (1 - 0.4553 - 0.3377)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { position: 'absolute', top: 0, flexDirection: 'row', alignItems: 'center', gap: 10 },
});
