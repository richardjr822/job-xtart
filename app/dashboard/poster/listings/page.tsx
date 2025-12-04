'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth, useData, useToast } from '@/context';
import { JOB_STATUS } from '@/constants';
import Button from '@/components/1-atoms/Button';
import { ConfirmModal } from '@/components/1-atoms/Modal';
import styles from '../../dashboard.module.css';

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-[var(--success-light)] text-[var(--success)]',
  in_progress: 'bg-[var(--primary-light)] text-[var(--primary)]',
  completed: 'bg-[var(--button-secondary-bg)] text-[var(--text-muted)]',
  cancelled: 'bg-[var(--danger-light)] text-[var(--danger)]',
};

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function MyListings() {
  const { user } = useAuth();
  const { getJobsByPosterId, deleteJob, updateJob, getApplicationsByJobId, getUserById, getReviewsByJobId, addReview, addNotification } = useData();
  const { showToast } = useToast();

  const jobs = user ? getJobsByPosterId(user.id) : [];
  
  const [reviewingJob, setReviewingJob] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteJobId) return;
    setIsDeleting(true);
    try {
      await deleteJob(deleteJobId);
      showToast('Job deleted successfully', 'success');
    } catch {
      showToast('Failed to delete job', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteJobId(null);
    }
  };

  const handleComplete = async (jobId: string) => {
    const job = jobs.find(j => j._id === jobId);
    if (!job) return;

    try {
      await updateJob(jobId, { status: 'completed', completedAt: new Date() });
      
      if (job.assignedTo) {
        await addNotification({
          userId: job.assignedTo,
          type: 'job_completed',
          title: 'Job Marked Complete',
          message: `The client has marked "${job.title}" as completed. You can now leave a review.`,
          data: { jobId },
        });
      }

      showToast('Job marked as completed', 'success');
      setReviewingJob(jobId);
    } catch {
      showToast('Failed to complete job', 'error');
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewingJob || !user) return;
    
    const job = jobs.find(j => j._id === reviewingJob);
    if (!job || !job.assignedTo) {
      setReviewingJob(null);
      return;
    }

    try {
      await addReview({
        jobId: reviewingJob,
        reviewerId: user.id,
        revieweeId: job.assignedTo,
        rating,
        comment: comment.trim() || '',
        createdAt: new Date(),
      });

      await addNotification({
        userId: job.assignedTo,
        type: 'review_received',
        title: 'New Review Received',
        message: `You received a ${rating}-star review for "${job.title}"`,
        data: { jobId: reviewingJob },
      });

      showToast('Review submitted successfully', 'success');
      setReviewingJob(null);
      setRating(5);
      setComment('');
    } catch {
      showToast('Failed to submit review', 'error');
    }
  };

  const hasReviewed = (jobId: string) => {
    const reviews = getReviewsByJobId(jobId);
    return reviews.some(r => r.reviewerId === user?.id);
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Listings</h1>
        <p className={styles.pageDescription}>Manage your posted jobs</p>
      </div>

      {jobs.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M7 7h10M7 12h10M7 17h6" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>No listings yet</h3>
          <p className={styles.emptyText}>Post your first job to get started</p>
        </div>
      )}

      <div className={styles.grid}>
        {jobs.map((job) => {
          const applications = getApplicationsByJobId(job._id);
          const pendingCount = applications.filter(a => a.status === 'pending').length;
          const assignedUser = job.assignedTo ? getUserById(job.assignedTo) : null;
          const reviewed = hasReviewed(job._id);

          return (
            <article key={job._id} className={styles.card}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-[var(--text-color)]">
                  {job.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[job.status] || STATUS_STYLES.open}`}>
                  {job.status.replace('_', ' ')}
                </span>
              </div>

              <span className="inline-block px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-xs font-semibold rounded-full mb-3">
                {job.category}
              </span>

              <p className="text-[var(--text-muted)] text-sm mb-3 line-clamp-2">
                {job.description}
              </p>

              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-[var(--text-muted)]">{job.location}</span>
                <span className="text-[var(--primary)] font-semibold">₱{job.rate}/hr</span>
              </div>

              {job.status === 'open' && pendingCount > 0 && (
                <div className="p-2 bg-[var(--warning-light)] text-[var(--warning)] rounded-[var(--radius-sm)] text-sm mb-3">
                  {pendingCount} pending application{pendingCount > 1 ? 's' : ''}
                </div>
              )}

              {assignedUser && (
                <div className="p-2 bg-[var(--primary-light)] rounded-[var(--radius-sm)] text-sm mb-3">
                  <span className="text-[var(--text-muted)]">Assigned to: </span>
                  <span className="text-[var(--primary)] font-medium">{assignedUser.username}</span>
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t border-[var(--border-color)]">
                {job.status === 'open' && (
                  <>
                    {pendingCount > 0 && (
                      <Link href="/dashboard/poster/applicants" className="flex-1">
                        <Button variant="secondary" size="sm" fullWidth>
                          View Applicants
                        </Button>
                      </Link>
                    )}
                    <Button onClick={() => setDeleteJobId(job._id)} variant="danger" size="sm">
                      Delete
                    </Button>
                  </>
                )}
                {job.status === 'in_progress' && (
                  <Button onClick={() => handleComplete(job._id)} variant="primary" size="sm" fullWidth>
                    Mark Complete
                  </Button>
                )}
                {job.status === 'completed' && assignedUser && !reviewed && (
                  <Button onClick={() => setReviewingJob(job._id)} variant="secondary" size="sm" fullWidth>
                    Leave Review
                  </Button>
                )}
                {job.status === 'completed' && reviewed && (
                  <span className="text-sm text-[var(--text-muted)] w-full text-center py-2">
                    Review Submitted
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {reviewingJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-[var(--text-color)] mb-4">
              Rate the Job Seeker
            </h2>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-[var(--text-color)]">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 transition-colors ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    <StarIcon />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-[var(--text-color)]">
                Comment (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this worker..."
                rows={3}
                className="w-full p-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--page-bg)] text-[var(--text-color)] resize-none focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setReviewingJob(null)} fullWidth>
                Skip
              </Button>
              <Button variant="primary" onClick={handleSubmitReview} fullWidth>
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteJobId}
        onClose={() => setDeleteJobId(null)}
        onConfirm={handleDelete}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
