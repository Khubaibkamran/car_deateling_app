import { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import BottomNavBar, { Tab, TabKey } from '../../components/BottomNavBar';
import FadeIn from '../../components/FadeIn';
import { colors } from '../../constants/theme';

export const NAV_HEIGHT = 100;

type Props = {
  tab: TabKey;
  onTabChange: (tab: TabKey) => void;
  /** Which tabs to show; defaults to the customer app's. */
  tabs?: Tab[];
  children: ReactNode;
};

// Frame for the main tab screens. The nav bar lives here, not in each screen, so its bubble can
// glide between tabs instead of being rebuilt every time you switch.
export default function MainShell({ tab, onTabChange, tabs, children }: Props) {
  const { width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      {children}
      <FadeIn delay={500} distance={NAV_HEIGHT} style={[styles.nav, { width }]}>
        <BottomNavBar active={tab} onChange={onTabChange} tabs={tabs} />
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  nav: { position: 'absolute', left: 0, bottom: 0, height: NAV_HEIGHT },
});
