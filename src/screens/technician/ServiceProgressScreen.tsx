import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FadeIn from '../../components/FadeIn';
import { CalendarLineIcon, ClockLightIcon } from '../../components/flowIcons';
import GlowCard from '../../components/GlowCard';
import { CheckboxIcon } from '../../components/jobIcons';
import PhotoUploader from '../../components/PhotoUploader';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import TireBackground from '../../components/TireBackground';
import { colors } from '../../constants/theme';
import { JobDetail } from '../../data/jobDetails';
import { apiMessage } from '../../api/errors';
import { completeJob, deleteJobPhoto, setChecklistItem, uploadJobPhoto } from '../../api/technician';
import { JobCompletedModal, SignatureModal } from './JobModals';

type Props = {
  job: JobDetail;
  onBack?: () => void;
  /** Called after the job is signed off and the completion message is closed. */
  onFinish?: () => void;
};

function Dot() {
  return <View style={styles.dot} />;
}

/** "42m" below an hour, "1hr 05m" after. */
function formatElapsed(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}hr ${`${minutes % 60}`.padStart(2, '0')}m`;
}

// While working: tick off steps, attach before/after photos, then get the customer's signature.
export default function ServiceProgressScreen({ job, onBack, onFinish }: Props) {
  const [checked, setChecked] = useState<boolean[]>(() => job.checklist.map((c) => c.done));
  const [before, setBefore] = useState<string[]>(() => job.beforePhotos.map((p) => p.uri));
  const [after, setAfter] = useState<string[]>(() => job.afterPhotos.map((p) => p.uri));
  // Server ids of the photos already uploaded, keyed by their address, so one can be removed again.
  const photoIds = useRef<Record<string, number>>(
    Object.fromEntries([...job.beforePhotos, ...job.afterPhotos].map((p) => [p.uri, p.id])),
  );
  const [problem, setProblem] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState('');
  const [done, setDone] = useState(false);

  const [elapsed, setElapsed] = useState(0);
  const started = useRef(job.startedAt ? new Date(job.startedAt).getTime() : Date.now());
  useEffect(() => {
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - started.current) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Ticks the step straight away and tells the server; undoes it if the server refuses.
  const toggle = async (i: number) => {
    const value = !checked[i];
    setChecked((c) => c.map((v, j) => (j === i ? value : v)));
    setProblem(null);
    try {
      await setChecklistItem(job.id, job.checklist[i].id, value);
    } catch (e) {
      setChecked((c) => c.map((v, j) => (j === i ? !value : v)));
      setProblem(apiMessage(e, 'Could not update that step.'));
    }
  };

  // Photos are uploaded as soon as they are picked and deleted from the server when removed.
  const syncPhotos = (kind: 'before' | 'after', prev: string[], next: string[], set: (fn: (l: string[]) => string[]) => void) => {
    set(() => next);
    setProblem(null);
    prev
      .filter((u) => !next.includes(u))
      .forEach((u) => {
        const id = photoIds.current[u];
        if (id) deleteJobPhoto(job.id, id).catch((e) => setProblem(apiMessage(e, 'Could not remove that photo.')));
      });
    next
      .filter((u) => !prev.includes(u))
      .forEach((u) => {
        uploadJobPhoto(job.id, kind, u).then(
          (photo) => {
            photoIds.current[u] = photo.id;
          },
          (e) => {
            set((l) => l.filter((x) => x !== u));
            setProblem(apiMessage(e, 'Could not upload that photo.'));
          },
        );
      });
  };

  const next = () => {
    const open = checked.filter((v) => !v).length;
    if (before.length === 0) setProblem('Add at least one “before” photo.');
    else if (open > 0) setProblem(`Finish the remaining ${open} step${open === 1 ? '' : 's'} first.`);
    else if (after.length === 0) setProblem('Add at least one “after” photo.');
    else {
      setProblem(null);
      setCompleteError('');
      setSigning(true);
    }
  };

  const complete = async (signatureSvg: string) => {
    if (completing) return;
    setCompleting(true);
    setCompleteError('');
    try {
      await completeJob(job.id, signatureSvg);
      setSigning(false);
      setDone(true);
    } catch (e) {
      setCompleteError(apiMessage(e, 'Could not complete the job. Please try again.'));
    } finally {
      setCompleting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TireBackground opacity={0.05} />
      <FadeIn delay={50} distance={-12}>
        <ScreenHeader title="Service Progress" onBack={onBack} font="redhat" />
      </FadeIn>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <FadeIn delay={150} distance={24}>
          <GlowCard tire>
            <View style={styles.serviceRow}>
              <Image source={require('../../../assets/images/payment/service-thumb.jpg')} style={styles.thumb} />
              <View style={styles.serviceInfo}>
                <View style={styles.serviceTop}>
                  <View style={styles.serviceNames}>
                    <Text style={styles.serviceName} numberOfLines={1}>
                      {job.service}
                    </Text>
                    <Text style={styles.plan}>{job.plan}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>In-progress</Text>
                  </View>
                </View>
                <View style={styles.when}>
                  <CalendarLineIcon />
                  <Text style={styles.whenText}>
                    {job.date} - {job.time}
                  </Text>
                  <Dot />
                  <ClockLightIcon />
                  <Text style={styles.whenText}>{formatElapsed(elapsed)}</Text>
                </View>
              </View>
            </View>
          </GlowCard>
        </FadeIn>

        <FadeIn delay={250} distance={24}>
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Upload</Text>
            <Text style={styles.blockSub}>Before images of vehicle</Text>
          </View>
          <GlowCard style={styles.uploadCard}>
            <PhotoUploader photos={before} onChange={(p) => syncPhotos('before', before, p, setBefore)} />
          </GlowCard>
        </FadeIn>

        <FadeIn delay={350} distance={24}>
          <Text style={styles.blockTitle}>Service Progress</Text>
          <View style={styles.checklist}>
            {job.checklist.map((step, i) => (
              <Pressable
                key={step.id}
                style={styles.check}
                onPress={() => toggle(i)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: checked[i] }}
              >
                <CheckboxIcon checked={checked[i]} />
                <Text style={[styles.checkText, checked[i] && styles.checkTextDone]}>{step.text}</Text>
              </Pressable>
            ))}
          </View>
        </FadeIn>

        <FadeIn delay={450} distance={24}>
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Upload</Text>
            <Text style={styles.blockSub}>After images of vehicle</Text>
          </View>
          <GlowCard style={styles.uploadCard}>
            <PhotoUploader photos={after} onChange={(p) => syncPhotos('after', after, p, setAfter)} />
          </GlowCard>
        </FadeIn>

        <FadeIn delay={550} distance={30} style={styles.action}>
          {problem && <Text style={styles.problem}>{problem}</Text>}
          <PrimaryButton title="Continue" onPress={next} />
        </FadeIn>
      </ScrollView>

      <SignatureModal
        visible={signing}
        onClose={() => setSigning(false)}
        onComplete={complete}
        loading={completing}
        error={completeError}
      />
      <JobCompletedModal
        visible={done}
        onClose={() => {
          setDone(false);
          onFinish?.();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  scroll: { flex: 1, marginTop: 24 },
  content: { paddingHorizontal: 24, paddingBottom: 50, gap: 24 },
  serviceRow: { flexDirection: 'row', gap: 12 },
  thumb: { width: 80, height: 80, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  serviceInfo: { flex: 1, gap: 11 },
  serviceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  serviceNames: { flex: 1, gap: 4, paddingRight: 8 },
  serviceName: { fontFamily: 'Poppins_500Medium', fontSize: 16, letterSpacing: -0.5, color: colors.text },
  plan: { fontFamily: 'Poppins_500Medium', fontSize: 14, color: colors.textSecondary },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, backgroundColor: colors.blue },
  badgeText: { fontFamily: 'Poppins_500Medium', fontSize: 11, color: colors.text },
  when: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  whenText: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textSecondary },
  block: { marginBottom: 12, gap: 2 },
  blockTitle: { fontFamily: 'RedHatDisplay_600SemiBold', fontSize: 18, letterSpacing: 0.36, color: colors.white },
  blockSub: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.textSecondary },
  uploadCard: { padding: 12 },
  checklist: { gap: 14, marginTop: 14 },
  check: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkText: { flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.textSecondary },
  checkTextDone: { color: colors.text },
  action: { gap: 10 },
  problem: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: colors.red, textAlign: 'center' },
});
