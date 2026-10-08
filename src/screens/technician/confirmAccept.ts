import { Alert } from '../../components/AppAlert';
import { apiMessage } from '../../api/errors';
import { acceptJob } from '../../api/technician';
import { Job } from '../../data/jobs';

/**
 * An open job isn't yours yet: ask first, then it becomes a normal upcoming job.
 * `onAccepted` gets the job to open; `onFailed` runs after an error so the list can refresh.
 */
export function confirmAccept(job: Job, onAccepted: (job: Job) => void, onFailed?: () => void) {
  Alert.alert('Take this job?', `${job.title} for ${job.customer} on ${job.when} at ${job.time}.`, [
    { text: 'Not now', style: 'cancel' },
    {
      text: 'Accept',
      onPress: async () => {
        try {
          await acceptJob(job.id);
          onAccepted({ ...job, status: 'upcoming' });
        } catch (e) {
          Alert.alert('My Jobs', apiMessage(e));
          onFailed?.();
        }
      },
    },
  ]);
}
