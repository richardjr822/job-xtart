'use client';

import { useState } from 'react';
import { useAuth, useData, useToast } from '@/context';
import Button from '@/components/1-atoms/Button';
import { ConfirmModal } from '@/components/1-atoms/Modal';
import styles from '../../dashboard.module.css';

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'rgba(234, 179, 8, 0.1)', text: '#ca8a04' },
  accepted: { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a' },
  rejected: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626' },
  withdrawn: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' },
};

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function MyApplications() {
  const { user } = useAuth();
  const { getApplicationsBySeekerId, getJobById, getUserById, updateApplication } = useData();
  const { showToast } = useToast();

  const applications = user ? getApplicationsBySeekerId(user.id) : [];
  const [withdrawId, setWithdrawId] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (!withdrawId) return;
    setIsWithdrawing(true);
    try {
      await updateApplication(withdrawId, { status: 'withdrawn' });
      showToast('Application withdrawn', 'success');
    } catch {
      showToast('Failed to withdraw application', 'error');
    } finally {
      setIsWithdrawing(false);
      setWithdrawId(null);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Applications</h1>
        <p className={styles.pageDescription}>Track your job applications</p>
      </div>

      {applications.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>No applications yet</h3>
          <p className={styles.emptyText}>Start applying to jobs to see them here</p>
        </div>
      )}

      <div className={styles.grid}>
        {applications.map((app) => {
          const status = statusColors[app.status] || statusColors.pending;
          const job = getJobById(app.jobId);
          const poster = job ? getUserById(job.posterId) : null;

          return (
            <div key={app._id} className={styles.card}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-[var(--text-color)] mb-1 truncate">
                    {job?.title || 'Job Not Found'}
                  </h3>
                  {job && (
                    <span className="inline-block px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-xs font-semibold rounded-full">
                      {job.category}
                    </span>
                  )}
                </div>
                <span 
                  className="ml-2 px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap"
                  style={{ backgroundColor: status.bg, color: status.text }}
                >
                  {app.status}
                </span>
              </div>

              {job && (
                <>
                  <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] mb-2">
                    <LocationIcon />
                    <span>{job.location}</span>
                    <span className="mx-1">•</span>
                    <span className="text-[var(--success)] font-medium">₱{job.rate}/hr</span>
                  </div>
                  {poster && (
                    <p className="text-xs text-[var(--text-muted)] mb-3">
                      Posted by {poster.username}
                    </p>
                  )}
                </>
              )}

              {app.message && (
                <p className="text-[var(--text-muted)] text-sm italic mb-3 line-clamp-2">
                  &ldquo;{app.message}&rdquo;
                </p>
              )}

              <p className="text-xs text-[var(--text-muted)] mb-3">
                Applied {new Date(app.createdAt).toLocaleDateString()}
              </p>

              {app.status === 'accepted' && (
                <div className="p-3 bg-[var(--success-light)] rounded-[var(--radius-md)] text-sm text-[var(--success)] font-medium">
                  You&apos;ve been hired! Check Active Jobs for details.
                </div>
              )}

              {app.status === 'rejected' && (
                <div className="p-3 bg-[var(--danger-light)] rounded-[var(--radius-md)] text-sm text-[var(--danger)]">
                  This application was not accepted.
                </div>
              )}

              {app.status === 'pending' && (
                <Button variant="ghost" size="sm" onClick={() => setWithdrawId(app._id)}>
                  Withdraw Application
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={!!withdrawId}
        onClose={() => setWithdrawId(null)}
        onConfirm={handleWithdraw}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this application? This action cannot be undone."
        confirmText="Withdraw"
        variant="warning"
        isLoading={isWithdrawing}
      />
    </div>
  );
}
