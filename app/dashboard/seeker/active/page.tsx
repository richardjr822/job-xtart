'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth, useData } from '@/context';
import Button from '@/components/1-atoms/Button';
import styles from '../../dashboard.module.css';

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function ActiveJobs() {
  const { user } = useAuth();
  const { jobs, getUserById, getReviewsByJobId, addReview, updateJob, addNotification } = useData();
  
  const [reviewingJob, setReviewingJob] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const activeJobs = jobs.filter(j => j.assignedTo === user?.id && j.status === 'in_progress');
  const completedJobs = jobs.filter(j => j.assignedTo === user?.id && j.status === 'completed');

  const handleCompleteJob = async (jobId: string) => {
    const job = jobs.find(j => j._id === jobId);
    if (!job || !user) return;

    await updateJob(jobId, { status: 'completed', completedAt: new Date() });
    
    await addNotification({
      userId: job.posterId,
      type: 'job_completed',
      title: 'Job Completed',
      message: `${user.username || 'A seeker'} has marked "${job.title}" as completed.`,
      data: { jobId },
    });

    setReviewingJob(jobId);
  };

  const handleSubmitReview = async () => {
    if (!reviewingJob || !user) return;
    
    const job = jobs.find(j => j._id === reviewingJob);
    if (!job) return;

    await addReview({
      jobId: reviewingJob,
      reviewerId: user.id,
      revieweeId: job.posterId,
      rating,
      comment: comment.trim() || '',
      createdAt: new Date(),
    });

    await addNotification({
      userId: job.posterId,
      type: 'review_received',
      title: 'New Review Received',
      message: `You received a ${rating}-star review for "${job.title}"`,
      data: { jobId: reviewingJob },
    });

    setReviewingJob(null);
    setRating(5);
    setComment('');
  };

  const hasReviewed = (jobId: string) => {
    const reviews = getReviewsByJobId(jobId);
    return reviews.some(r => r.reviewerId === user?.id);
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Active Jobs</h1>
        <p className={styles.pageDescription}>Jobs you&apos;re currently working on</p>
      </div>

      {activeJobs.length === 0 && completedJobs.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4 12 14.01l-3-3" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>No active jobs</h3>
          <p className={styles.emptyText}>Jobs you&apos;re hired for will appear here</p>
        </div>
      )}

      {activeJobs.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-[var(--text-color)] mb-4">In Progress</h2>
          <div className={`${styles.grid} mb-8`}>
            {activeJobs.map((job) => {
              const poster = getUserById(job.posterId);
              return (
                <div key={job._id} className={styles.card}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-[var(--text-color)]">
                      {job.title}
                    </h3>
                    <span className="px-3 py-1 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-xs font-semibold">
                      In Progress
                    </span>
                  </div>
                  
                  <span className="inline-block px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-xs font-semibold rounded-full mb-3">
                    {job.category}
                  </span>

                  <p className="text-[var(--text-muted)] text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] mb-2">
                    <LocationIcon />
                    <span>{job.location}</span>
                  </div>

                  {poster && (
                    <p className="text-xs text-[var(--text-muted)] mb-4">
                      Client: {poster.username}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-[var(--border-color)]">
                    <span className="text-[var(--primary)] font-semibold">₱{job.rate}/hr</span>
                    <Button variant="primary" size="sm" onClick={() => handleCompleteJob(job._id)}>
                      Mark Complete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {completedJobs.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-[var(--text-color)] mb-4">Completed</h2>
          <div className={styles.grid}>
            {completedJobs.map((job) => {
              const poster = getUserById(job.posterId);
              const reviewed = hasReviewed(job._id);
              
              return (
                <div key={job._id} className={styles.card}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-[var(--text-color)]">
                      {job.title}
                    </h3>
                    <span className="px-3 py-1 bg-[var(--success-light)] text-[var(--success)] rounded-full text-xs font-semibold">
                      Completed
                    </span>
                  </div>

                  <p className="text-[var(--text-muted)] text-sm mb-3">
                    {job.category} • {job.location}
                  </p>

                  {poster && (
                    <p className="text-xs text-[var(--text-muted)] mb-4">
                      Client: {poster.username}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-[var(--border-color)]">
                    <span className="text-[var(--success)] font-semibold">₱{job.rate}/hr</span>
                    {reviewed ? (
                      <span className="text-sm text-[var(--text-muted)]">Review Submitted</span>
                    ) : (
                      <Button variant="secondary" size="sm" onClick={() => setReviewingJob(job._id)}>
                        Leave Review
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {reviewingJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-[var(--text-color)] mb-4">
              Rate Your Experience
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
                placeholder="Share your experience..."
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
    </div>
  );
}
