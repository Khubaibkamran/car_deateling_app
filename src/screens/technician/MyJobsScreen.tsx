import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import FadeIn from '../../components/FadeIn';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { jobFromApi } from '../../api/mappers';
import { getJobs, getOpenJobs } from '../../api/technician';
import { confirmAccept } from './confirmAccept';
import StateView from '../../components/StateView';
import { Job, JobStatus } from '../../data/jobs';
import { useApi } from '../../hooks/useApi';
import JobCard from './JobCard';

const NAV_HEIGHT = 100;

const TABS: { key: JobStatus; label: string; empty: string }[] = [
  { key: 'upcoming', label: 'Upcoming', empty: 'No upcoming jobs right now.' },
  { key: 'inProgress', label: 'In Progress', empty: 'You have no jobs in progress.' },
  { key: 'completed', label: 'Completed', empty: 'Finished jobs will show up here.' },
  { key: 'available', label: 'Open', empty: 'No open jobs at the moment. Check back soon.' },
];

type Props = {
  onOpenJob?: (job: Job) => void;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
  notifications?: number;
};

// Every job, split by what stage it's at.
export default function MyJobsScreen({ onOpenJob, onMenuPress, onNotificationsPress, notifications }: Props) {
  const [status, setStatus] = useState<JobStatus>('upcoming');
  const tab = TABS.find((t) => t.key === status)!;
  // One request for everything; the three tabs just split it up.
  const { data, loading, error, reload } = useApi(async () => {
    const [mine, open] = await Promise.all([getJobs(), getOpenJobs()]);
    return [...mine.map(jobFromApi), ...open.map((j, i) => ({ ...jobFromApi(j, i), status: 'available' as const }))];
  }, []);
  const grouped: Record<JobStatus, Job[]> = {
    available: (data ?? []).filter((j) => j.status === 'available'),
    upcoming: (data ?? []).filter((j) => j.status === 'upcoming'),
    inProgress: (data ?? []).filter((j) => j.status === 'inProgress'),
    completed: (data ?? []).filter((j) => j.status === 'completed'),
  };
  const jobs = grouped[status];

  // An open job isn't yours yet: ask first, then it becomes a normal upcoming job.
  const open = (job: Job) => {
    if (job.status !== 'available') {
      onOpenJob?.(job);
      return;
    }
    confirmAccept(job, (accepted) => onOpenJob?.(accepted), reload);
  };

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <AppHeader onMenuPress={onMenuPress} onNotificationsPress={onNotificationsPress} notifications={notifications} />

      <FadeIn delay={150} style={styles.heading}>
        <Text style={styles.title}>My Jobs</Text>
        <Text style={styles.subtitle}>Everything you’ve been assigned, in one place</Text>
      </FadeIn>

      <FadeIn delay={250} style={styles.tabs}>
        {TABS.map((t) => {
          const active = t.key === status;
          return (
            <Pressable key={t.key} onPress={() => setStatus(t.key)} style={[styles.tab, active && styles.tabActive]}>
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
              <View style={[styles.count, active && styles.countActive]}>
                <Text style={[styles.countText, active && styles.countTextActive]}>{grouped[t.key].length}</Text>
              </View>
            </Pressable>
          );
        })}
      </FadeIn>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        <StateView loading={loading && !data} error={data ? undefined : error} onRetry={reload} />
        {!data ? null : jobs.length === 0 ? (
          <FadeIn style={styles.empty}>
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptyText}>{tab.empty}</Text>
          </FadeIn>
        ) : (
          // Keyed by the tab so the cards animate in again whenever you switch.
          jobs.map((job, i) => (
            <FadeIn key={`${status}-${job.id}`} delay={i * 70} distance={24}>
              <JobCard job={job} onPress={() => open(job)} />
            </FadeIn>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  heading: { marginTop: 32, marginHorizontal: 24, gap: 4 },
  title: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, letterSpacing: 0.36, color: colors.white },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.textSecondary },
  tabs: { marginTop: 16, marginHorizontal: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.text, borderColor: colors.text },
  tabText: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.textSecondary },
  tabTextActive: { color: colors.background },
  count: { minWidth: 20, height: 18, borderRadius: 9, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.border },
  countActive: { backgroundColor: colors.primary },
  countText: { fontFamily: 'Poppins_600SemiBold', fontSize: 10, color: colors.text },
  countTextActive: { color: colors.white },
  list: { flex: 1, marginTop: 16 },
  listContent: { paddingHorizontal: 24, paddingBottom: NAV_HEIGHT + 24, gap: 16 },
  empty: { alignItems: 'center', gap: 4, paddingTop: 60 },
  emptyTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: colors.text },
  emptyText: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
});
