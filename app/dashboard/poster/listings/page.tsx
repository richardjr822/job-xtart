'use client';

import { useState } from 'react';
import { useAuth } from '@/context';
import { JOB_STATUS } from '@/constants';
import Button from '@/components/1-atoms/Button';
import styles from '../../dashboard.module.css';
import type { Job } from '@/interfaces';

// Mock data for frontend-only
const MOCK_LISTINGS: Job[] = [
  { _id: '1', title: 'Garden Cleaning', description: 'Help maintain a beautiful garden.', category: 'Gardening', location: 'Makati City', rate: 250, status: 'open', posterId: 'user-1', createdAt: new Date() },
  { _id: '2', title: 'House Painting', description: 'Interior painting for a 2-bedroom apartment.', category: 'Repairs', location: 'Quezon City', rate: 300, status: 'in_progress', posterId: 'user-1', createdAt: new Date() },
];

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-[var(--success-light)] text-[var(--success)]',
  in_progress: 'bg-[var(--primary-light)] text-[var(--primary)]',
  completed: 'bg-[var(--button-secondary-bg)] text-[var(--text-muted)]',
  cancelled: 'bg-[var(--danger-light)] text-[var(--danger)]',
};

export default function MyListings() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(MOCK_LISTINGS);
  const [isLoading] = useState(false);

  const handleComplete = async (id: string) => {
    if (confirm('Mark this job as completed?')) {
      setJobs(prev => prev.map(job => job._id === id ? { ...job, status: JOB_STATUS.COMPLETED } : job));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      setJobs(prev => prev.filter(job => job._id !== id));
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Listings</h1>
        <p className={styles.pageDescription}>Manage your posted jobs</p>
      </div>

      {isLoading && <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>}

      {!isLoading && jobs.length === 0 && (
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
        {jobs.map((job) => (
          <article key={job._id} className={styles.card}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-color)]">
                {job.title}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[job.status] || STATUS_STYLES.open}`}>
                {job.status.replace('_', ' ')}
              </span>
            </div>

            <p className="text-[var(--text-muted)] text-sm mb-4 line-clamp-2">
              {job.description}
            </p>

            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-[var(--text-muted)]">{job.location}</span>
              <span className="text-[var(--primary)] font-semibold">₱{job.rate}/hr</span>
            </div>

            <div className="flex gap-2">
              {job.status === JOB_STATUS.IN_PROGRESS && (
                <Button onClick={() => handleComplete(job._id)} variant="primary" size="sm">
                  Mark Complete
                </Button>
              )}
              {job.status === JOB_STATUS.OPEN && (
                <Button onClick={() => handleDelete(job._id)} variant="danger" size="sm">
                  Delete
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
