import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getTechnicians } from '../../api/customer';
import { ApiTechnicianCard } from '../../api/types';
import { StarSolidIcon } from '../../components/extraIcons';
import FadeIn from '../../components/FadeIn';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import StateView from '../../components/StateView';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { useApi } from '../../hooks/useApi';

type Props = {
  /** The booking time (ISO), so each technician can say whether they are free then. */
  scheduledAt?: string;
  planId?: number;
  selectedId?: number;
  /** `null` means "any available technician". */
  onSelect: (technician: ApiTechnicianCard | null) => void;
  onBack?: () => void;
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function TechnicianCard({ tech, selected, onSelect }: { tech: ApiTechnicianCard; selected: boolean; onSelect: () => void }) {
  const busy = tech.is_free === false;
  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <View style={styles.top}>
        {tech.photo ? (
          <Image source={{ uri: tech.photo }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.initial]}>
            <Text style={styles.initialText}>{tech.full_name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.who}>
          <Text style={styles.name} numberOfLines={1}>
            {tech.full_name}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            {tech.specialty || 'All-round detailer'} · ID:{tech.employee_code}
          </Text>
          {tech.is_free !== null && (
            <View style={[styles.chip, busy ? styles.chipBusy : styles.chipFree]}>
              <Text style={styles.chipText}>{busy ? 'Busy at your time' : 'Free at your time'}</Text>
            </View>
          )}
        </View>
        {tech.rating !== null && (
          <View style={styles.rating}>
            <StarSolidIcon />
            <Text style={styles.ratingText}>{tech.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <View style={styles.stats}>
        <Stat value={`${tech.jobs_completed}`} label="Jobs done" />
        <Stat value={tech.experience || '—'} label="Experience" />
        <Stat value={tech.rating_count ? `${tech.rating_count}` : 'New'} label="Reviews" />
      </View>

      {!!tech.city && <Text style={styles.sub}>Based in {tech.city}</Text>}
      {!!tech.bio && <Text style={styles.bio}>{tech.bio}</Text>}

      <View style={styles.action}>
        <PrimaryButton
          title={selected ? 'Selected' : busy ? 'Not available' : `Book with ${tech.full_name.split(' ')[0]}`}
          variant={selected ? 'outline' : 'solid'}
          onPress={() => !busy && onSelect()}
        />
      </View>
    </View>
  );
}

// Everyone who takes jobs, with their record, so the customer can choose who comes.
export default function TechniciansScreen({ scheduledAt, planId, selectedId, onSelect, onBack }: Props) {
  const { data, loading, error, reload } = useApi(() => getTechnicians(scheduledAt, planId), [scheduledAt, planId]);

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title="Choose a Technician" onBack={onBack} font="redhat" />
      </FadeIn>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FadeIn delay={100} style={styles.heading}>
          <Text style={styles.title}>Who should come?</Text>
          <Text style={styles.subtitle}>Pick a technician, or let us send the best one who is free.</Text>
        </FadeIn>

        <FadeIn delay={150}>
          <Pressable onPress={() => onSelect(null)} style={[styles.any, !selectedId && styles.cardSelected]}>
            <Text style={styles.anyTitle}>Any available technician</Text>
            <Text style={styles.sub}>We assign the best-rated technician who is free</Text>
          </Pressable>
        </FadeIn>

        <StateView loading={loading && !data} error={data ? undefined : error} onRetry={reload} />
        {data && data.length === 0 && (
          <Text style={styles.empty}>No technicians are taking jobs right now. We’ll assign one when you book.</Text>
        )}
        {(data ?? []).map((tech, i) => (
          <FadeIn key={tech.id} delay={200 + i * 70} distance={20}>
            <TechnicianCard tech={tech} selected={selectedId === tech.id} onSelect={() => onSelect(tech)} />
          </FadeIn>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 50, gap: 16 },
  heading: { gap: 4 },
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, letterSpacing: 0.36, color: colors.white },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.textSecondary },
  empty: { fontFamily: 'Poppins_400Regular', fontSize: 13, color: colors.textSecondary, textAlign: 'center', paddingVertical: 24 },
  any: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, gap: 2, backgroundColor: colors.background },
  anyTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: colors.text },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, gap: 12, backgroundColor: colors.background },
  cardSelected: { borderColor: colors.primary },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  photo: { width: 56, height: 56, borderRadius: 12 },
  initial: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.border },
  initialText: { fontFamily: 'Poppins_600SemiBold', fontSize: 22, color: colors.text },
  who: { flex: 1, gap: 2 },
  name: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: colors.text },
  sub: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
  chip: { alignSelf: 'flex-start', marginTop: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  chipFree: { backgroundColor: colors.green },
  chipBusy: { backgroundColor: colors.red },
  chipText: { fontFamily: 'Poppins_500Medium', fontSize: 10, color: colors.background },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4, backgroundColor: '#FFCC00' },
  ratingText: { fontFamily: 'Poppins_500Medium', fontSize: 11, color: colors.background },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8, backgroundColor: colors.surface },
  statValue: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: colors.text, textAlign: 'center' },
  statLabel: { fontFamily: 'Poppins_400Regular', fontSize: 10, color: colors.textSecondary },
  bio: { fontFamily: 'Poppins_400Regular', fontSize: 13, lineHeight: 19, color: colors.text },
  action: { marginTop: 4 },
});
