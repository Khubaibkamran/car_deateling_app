import { ComponentType, ReactNode, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { ChevronRightIcon } from '../../components/drawerIcons';
import FadeIn from '../../components/FadeIn';
import LogoutButton from '../../components/LogoutButton';
import TireBackground from '../../components/TireBackground';
import ToggleSwitch from '../../components/ToggleSwitch';
import { colors } from '../../constants/theme';
import { UserProfile } from '../../types/profile';

const NAV_HEIGHT = 100;

type IconComponent = ComponentType<{ color?: string; size?: number }>;

export type ProfileRow = {
  key: string;
  Icon: IconComponent;
  label: string;
  onPress?: () => void;
  /** Shows an on/off switch (starting on) instead of the arrow. */
  toggle?: boolean;
};

export type ProfileGroup = { title: string; rows: ProfileRow[] };

function Row({ row, on, onToggle }: { row: ProfileRow; on: boolean; onToggle: (v: boolean) => void }) {
  const { Icon, label, onPress, toggle } = row;
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <View style={styles.rowIcon}>
        <Icon color={colors.textSecondary} size={20} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {toggle ? <ToggleSwitch value={on} onValueChange={onToggle} accessibilityLabel={label} /> : <ChevronRightIcon />}
    </Pressable>
  );
}

type Props = {
  profile: UserProfile;
  /** Line under the name, e.g. "Technician · Ceramic coating". */
  subtitle: string;
  stats: { value: string; label: string }[];
  groups: ProfileGroup[];
  onLogout: () => void;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
  notifications?: number;
};

// Account page shared by customers and technicians; each passes its own stats and menu groups.
export default function ProfileScreen({
  profile,
  subtitle,
  stats,
  groups,
  onLogout,
  onMenuPress,
  onNotificationsPress,
  notifications,
}: Props) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const isOn = (key: string) => toggles[key] ?? true;

  let step = 0;
  const next = (): number => 330 + step++ * 80;

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <AppHeader onMenuPress={onMenuPress} onNotificationsPress={onNotificationsPress} notifications={notifications} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FadeIn delay={150} distance={24} style={styles.hero}>
          <View style={styles.avatar}>
            {profile.photo ? (
              <Image source={{ uri: profile.photo }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</Text>
            )}
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.role}>{subtitle}</Text>
        </FadeIn>

        <FadeIn delay={250} distance={24} style={styles.stats}>
          {stats.map(({ value, label }) => (
            <View key={label} style={styles.stat}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </FadeIn>

        {groups.map((g) => (
          <FadeIn key={g.title} delay={next()} distance={24}>
            <View style={styles.group}>
              <Text style={styles.groupTitle}>{g.title}</Text>
              <View style={styles.groupCard}>
                {g.rows.map((row) => (
                  <Row key={row.key} row={row} on={isOn(row.key)} onToggle={(v) => setToggles((t) => ({ ...t, [row.key]: v }))} />
                ))}
              </View>
            </View>
          </FadeIn>
        ))}

        <FadeIn delay={next()} distance={24}>
          <LogoutButton onPress={onLogout} />
        </FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  scroll: { flex: 1 },
  content: { paddingTop: 28, paddingHorizontal: 24, paddingBottom: NAV_HEIGHT + 24, gap: 20 },
  hero: { alignItems: 'center', gap: 4 },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,138,0,0.15)',
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: 8,
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { fontFamily: 'RedHatDisplay_700Bold', fontSize: 36, color: colors.primary },
  name: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 20, letterSpacing: 0.4, color: colors.white },
  role: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, gap: 2 },
  statValue: { fontFamily: 'RedHatDisplay_700Bold', fontSize: 20, color: colors.white },
  statLabel: { fontFamily: 'Poppins_400Regular', fontSize: 11, color: colors.textSecondary },
  group: { gap: 8 },
  groupTitle: { fontFamily: 'Poppins_500Medium', fontSize: 12, letterSpacing: 0.6, color: colors.textSecondary, textTransform: 'uppercase' },
  groupCard: { borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, height: 56, paddingHorizontal: 16 },
  rowPressed: { backgroundColor: 'rgba(255,255,255,0.05)' },
  rowIcon: { width: 24, alignItems: 'center' },
  rowLabel: { flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.text },
});
