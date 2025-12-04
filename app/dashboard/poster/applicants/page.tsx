'use client';

import { useAuth, useData, useToast } from '@/context';
import { APPLICATION_STATUS } from '@/constants';
import Button from '@/components/1-atoms/Button';
import styles from '../../dashboard.module.css';

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'rgba(234, 179, 8, 0.1)', text: '#ca8a04' },
  accepted: { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a' },
  rejected: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626' },
  withdrawn: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' },
};

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const LocationIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function Applicants() {
  const { user } = useAuth();
  const { 
    getJobsByPosterId, 
    applications, 
    getJobById, 
    getUserById, 
    updateApplication, 
    updateJob,
    addNotification 
  } = useData();
  const { showToast } = useToast();

  const myJobs = user ? getJobsByPosterId(user.id) : [];
  const myJobIds = myJobs.map(j => j._id);
  const relevantApplications = applications.filter(a => myJobIds.includes(a.jobId));

  const handleAccept = async (appId: string) => {
    const app = applications.find(a => a._id === appId);
    if (!app) return;

    const job = getJobById(app.jobId);
    if (!job) return;

    try {
      await updateApplication(appId, { status: 'accepted', respondedAt: new Date() });
      
      await updateJob(job._id, { 
        status: 'in_progress', 
        assignedTo: app.seekerId 
      });

      const otherApps = applications.filter(a => a.jobId === app.jobId && a._id !== appId && a.status === 'pending');
      for (const a of otherApps) {
        await updateApplication(a._id, { status: 'rejected', respondedAt: new Date() });
        await addNotification({
          userId: a.seekerId,
          type: 'application_rejected',
          title: 'Application Update',
          message: `Your application for "${job.title}" was not selected. Keep applying!`,
          data: { jobId: job._id },
        });
      }

      await addNotification({
        userId: app.seekerId,
        type: 'application_accepted',
        title: 'Application Accepted!',
        message: `Congratulations! You've been hired for "${job.title}"`,
        data: { jobId: job._id },
      });

      showToast('Applicant accepted successfully', 'success');
    } catch {
      showToast('Failed to accept applicant', 'error');
    }
  };

  const handleReject = async (appId: string) => {
    const app = applications.find(a => a._id === appId);
    if (!app) return;

    const job = getJobById(app.jobId);
    if (!job) return;

    try {
      await updateApplication(appId, { status: 'rejected', respondedAt: new Date() });

      await addNotification({
        userId: app.seekerId,
        type: 'application_rejected',
        title: 'Application Update',
        message: `Your application for "${job.title}" was not selected.`,
        data: { jobId: job._id },
      });

      showToast('Applicant rejected', 'info');
    } catch {
      showToast('Failed to reject applicant', 'error');
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Applicants</h1>
        <p className={styles.pageDescription}>Review and manage job applications</p>
      </div>

      {relevantApplications.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>No applicants yet</h3>
          <p className={styles.emptyText}>Applications will appear here when seekers apply to your jobs</p>
        </div>
      )}

      <div className={styles.grid}>
        {relevantApplications.map((app) => {
          const status = statusColors[app.status] || statusColors.pending;
          const job = getJobById(app.jobId);
          const seeker = getUserById(app.seekerId);

          return (
            <div key={app._id} className={styles.card}>
              <div className="flex flex-col gap-2 mb-2.5 sm:flex-row sm:justify-between sm:items-start sm:mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--text-color)] mb-0.5 sm:text-base sm:mb-1">
                    {seeker?.username || 'Unknown Applicant'}
                  </h3>
                  {job && (
                    <p className="text-xs text-[var(--primary)] sm:text-sm">
                      For: {job.title}
                    </p>
                  )}
                </div>
                <span 
                  className="self-start px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize whitespace-nowrap sm:ml-2 sm:px-3 sm:py-1 sm:text-xs"
                  style={{ backgroundColor: status.bg, color: status.text }}
                >
                  {app.status}
                </span>
              </div>

              {seeker?.profile && (
                <div className="flex flex-wrap gap-2 text-[10px] text-[var(--text-muted)] mb-2.5 sm:gap-3 sm:text-xs sm:mb-3">
                  {seeker.profile.rating !== undefined && seeker.profile.rating > 0 && (
                    <span className="flex items-center gap-1 text-yellow-500">
                      <StarIcon />
                      {seeker.profile.rating.toFixed(1)}
                    </span>
                  )}
                  {seeker.profile.completedJobs !== undefined && seeker.profile.completedJobs > 0 && (
                    <span>{seeker.profile.completedJobs} jobs</span>
                  )}
                  {seeker.profile.location && (
                    <span className="flex items-center gap-1">
                      <LocationIcon />
                      {seeker.profile.location}
                    </span>
                  )}
                </div>
              )}

              {seeker?.profile?.skills && seeker.profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2.5 sm:mb-3">
                  {seeker.profile.skills.slice(0, 2).map((skill) => (
                    <span 
                      key={skill} 
                      className="px-1.5 py-0.5 bg-[var(--button-secondary-bg)] text-[var(--text-muted)] text-[10px] rounded-full sm:px-2 sm:text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {seeker.profile.skills.length > 2 && (
                    <span className="px-1.5 py-0.5 text-[var(--text-muted)] text-[10px] sm:px-2 sm:text-xs">
                      +{seeker.profile.skills.length - 2}
                    </span>
                  )}
                </div>
              )}

              {app.message && (
                <p className="text-[var(--text-muted)] text-xs italic mb-2.5 p-2 bg-[var(--page-bg)] rounded-[var(--radius-sm)] line-clamp-2 sm:text-sm sm:mb-3 sm:p-3">
                  &ldquo;{app.message}&rdquo;
                </p>
              )}

              <p className="text-[10px] text-[var(--text-muted)] mb-2.5 sm:text-xs sm:mb-3">
                Applied {new Date(app.createdAt).toLocaleDateString()}
              </p>

              {app.status === APPLICATION_STATUS.PENDING && (
                <div className="flex flex-col gap-2 pt-2.5 border-t border-[var(--border-color)] sm:flex-row sm:pt-3">
                  <Button onClick={() => handleAccept(app._id)} variant="primary" size="sm" fullWidth>
                    Accept
                  </Button>
                  <Button onClick={() => handleReject(app._id)} variant="danger" size="sm" fullWidth className="sm:w-auto">
                    Reject
                  </Button>
                </div>
              )}

              {app.status === APPLICATION_STATUS.ACCEPTED && (
                <div className="p-2 bg-[var(--success-light)] text-[var(--success)] rounded-[var(--radius-sm)] text-xs font-medium sm:p-3 sm:text-sm">
                  Hired for this job
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
