'use client';

import { useAuth, useData } from '@/context';
import styles from '../dashboard.module.css';

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill={filled ? 'currentColor' : 'none'} 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function ReviewsPage() {
  const { user } = useAuth();
  const { getReviewsByRevieweeId, getUserById, getJobById } = useData();

  const reviews = user ? getReviewsByRevieweeId(user.id) : [];

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Reviews</h1>
        <p className={styles.pageDescription}>See what others are saying about your work</p>
      </div>

      {reviews.length > 0 && (
        <div className="mb-8 p-6 bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--border-color)]">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-[var(--text-color)]">
              {averageRating.toFixed(1)}
            </div>
            <div>
              <div className="flex gap-1 text-yellow-500 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} filled={star <= Math.round(averageRating)} />
                ))}
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {reviews.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>No reviews yet</h3>
          <p className={styles.emptyText}>Complete jobs to receive reviews from clients</p>
        </div>
      )}

      <div className={styles.grid}>
        {reviews.map((review) => {
          const reviewer = getUserById(review.reviewerId);
          const job = getJobById(review.jobId);

          return (
            <div key={review._id} className={styles.card}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-color)]">
                    {reviewer?.username || 'Anonymous'}
                  </h3>
                  {job && (
                    <p className="text-sm text-[var(--text-muted)]">
                      For: {job.title}
                    </p>
                  )}
                </div>
                <div className="flex gap-0.5 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} filled={star <= review.rating} />
                  ))}
                </div>
              </div>

              {review.comment && (
                <p className="text-[var(--text-muted)] text-sm italic mb-3">
                  &ldquo;{review.comment}&rdquo;
                </p>
              )}

              <p className="text-xs text-[var(--text-muted)]">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
