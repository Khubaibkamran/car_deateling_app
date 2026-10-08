import { ReactNode, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import AppHeader from '../../components/AppHeader';
import { MoneyBagIcon, TaskIcon } from '../../components/extraIcons';
import FadeIn from '../../components/FadeIn';
import TireBackground from '../../components/TireBackground';
import { BEZIER_XML, WAVE_XML } from '../../components/technicianIconXml';
import ToggleSwitch from '../../components/ToggleSwitch';
import { colors } from '../../constants/theme';
import { Job, TECHNICIAN_NAME, TECHNICIAN_STATS, TechnicianStats, UPCOMING_JOBS } from '../../data/jobs';
import SectionHeader from '../home/SectionHeader';
import JobCard from './JobCard';

const NAV_HEIGHT = 100;

function StatCard({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <View style={styles.stat}>
      <View style={styles.statTop}>
        <View style={styles.statIcon}>{icon}</View>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

const pad = (n: number) => `${n}`.padStart(2, '0');

type Props = {
  /** First name shown in the greeting. */
  name?: string;
  /** Today's numbers; defaults to the design's sample figures. */
  stats?: TechnicianStats;
  onOpenJob?: (job: Job) => void;
  onViewAllJobs?: () => void;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
  /** Unread notifications shown on the bell. */
  notifications?: number;
};

// Technician home: availability, today's numbers and the next jobs.
export default function TechnicianHomeScreen({ name = TECHNICIAN_NAME, stats = TECHNICIAN_STATS, onOpenJob, onViewAllJobs, onMenuPress, onNotificationsPress, notifications }: Props) {
  const [available, setAvailable] = useState(true);
  const [dollars, cents] = stats.earningsToday.toFixed(2).split('.');

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <AppHeader onMenuPress={onMenuPress} onNotificationsPress={onNotificationsPress} notifications={notifications} />

      <FadeIn delay={150} style={styles.availability}>
        <Text style={styles.availabilityText}>Available for Jobs</Text>
        <ToggleSwitch value={available} onValueChange={setAvailable} accessibilityLabel="Available for jobs" />
      </FadeIn>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: NAV_HEIGHT + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn delay={250} style={styles.greeting}>
          <View style={styles.hello}>
            <Text style={styles.helloText}>Hi, {name}!</Text>
            <SvgXml xml={WAVE_XML} width={20} height={20} />
          </View>
          <Text style={styles.helloSub}>Here’s a quick look at your tasks and daily activity</Text>
        </FadeIn>

        <View style={styles.grid}>
          <FadeIn delay={350} distance={24} style={styles.cell}>
            <StatCard icon={<MoneyBagIcon />} label="Today’s Earning">
              <Text style={styles.value}>
                <Text style={styles.valueBig}>${dollars}</Text>
                <Text style={styles.valueSmall}>.{cents}</Text>
              </Text>
            </StatCard>
          </FadeIn>
          <FadeIn delay={420} distance={24} style={styles.cell}>
            <StatCard icon={<SvgXml xml={BEZIER_XML} width={18} height={18} />} label="Assigned Tasks">
              <Text style={styles.valueBig}>{pad(stats.assigned)}</Text>
            </StatCard>
          </FadeIn>
          <FadeIn delay={490} distance={24} style={styles.cell}>
            <StatCard icon={<TaskIcon />} label="In-Progress Tasks">
              <Text style={styles.valueBig}>{pad(stats.inProgress)}</Text>
            </StatCard>
          </FadeIn>
          <FadeIn delay={560} distance={24} style={styles.cell}>
            <StatCard icon={<TaskIcon />} label="Completed Tasks">
              <Text style={styles.valueBig}>{pad(stats.completed)}</Text>
            </StatCard>
          </FadeIn>
        </View>

        <FadeIn delay={650} style={styles.jobsSection}>
          <SectionHeader title="Upcoming Jobs" actionLabel="View All" onActionPress={onViewAllJobs} />
          <View style={styles.jobs}>
            {UPCOMING_JOBS.map((job) => (
              <JobCard key={job.id} job={job} onPress={() => onOpenJob?.(job)} />
            ))}
          </View>
        </FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  availability: {
    marginTop: 32,
    marginHorizontal: 24,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  availabilityText: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.text },
  scroll: { flex: 1, marginTop: 24 },
  greeting: { marginHorizontal: 24, gap: 4 },
  hello: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  helloText: { fontFamily: 'Poppins_500Medium', fontSize: 18, color: colors.text },
  helloSub: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.textSecondary },
  grid: { marginTop: 24, marginHorizontal: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: { width: '48.4%' },
  stat: {
    height: 105,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: 16,
  },
  statTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    shadowColor: '#fff',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statLabel: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
  value: { height: 45, lineHeight: 45 },
  valueBig: { fontFamily: 'RedHatDisplay_700Bold', fontSize: 30, lineHeight: 45, letterSpacing: 2, color: colors.white },
  valueSmall: { fontFamily: 'RedHatDisplay_700Bold', fontSize: 16, letterSpacing: 2, color: colors.white },
  jobsSection: { marginTop: 24, marginHorizontal: 24, gap: 16 },
  jobs: { gap: 16 },
});
