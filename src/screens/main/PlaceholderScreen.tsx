import { StyleSheet, Text, View } from 'react-native';
import FadeIn from '../../components/FadeIn';
import ScreenHeader from '../../components/ScreenHeader';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';

// Full-screen stand-in for menu pages that haven't been designed yet.
export default function PlaceholderScreen({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title={title} onBack={onBack} font="redhat" />
      </FadeIn>
      <FadeIn delay={200} style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>This screen is coming soon.</Text>
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, paddingBottom: 80 },
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, color: colors.white },
  text: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.textSecondary },
});
