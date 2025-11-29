'use client';

import { useState } from 'react';
import { JOB_STATUS } from '@/constants';
import Button from '@/components/1-atoms/Button';
import styles from '../../dashboard.module.css';
import type { Job } from '@/interfaces';

// Mock data for frontend-only
const MOCK_ACTIVE_JOBS: Job[] = [
  { _id: '10', title: 'Office Cleaning', description: 'Regular office cleaning service needed twice a week.', category: 'Cleaning', location: 'BGC', rate: 280, status: 'in_progress', posterId: 'p10', createdAt: new Date() },
];

export default function ActiveJobs() {
  const [jobs] = useState<Job[]>(MOCK_ACTIVE_JOBS);
  const [isLoading] = useState(false);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Active Jobs</h1>
        <p className={styles.pageDescription}>Jobs you're currently working on</p>
      </div>

      {isLoading && <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>}

      {!isLoading && jobs.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4 12 14.01l-3-3" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>No active jobs</h3>
          <p className={styles.emptyText}>Jobs you're hired for will appear here</p>
        </div>
      )}

      <div className={styles.grid}>
        {jobs.map((job) => (
          <div key={job._id} className={styles.card}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-color)' }}>
                  {job.title}
                </h3>
                <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                  In Progress
                </span>
              </div>
              <span style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 500 }}>
                {job.category}
              </span>
            </div>

            <p style={{ color: 'var(--text-color)', opacity: 0.7, marginBottom: '1rem', fontSize: '0.875rem', lineHeight: 1.5 }}>
              {job.description?.substring(0, 100)}...
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-color)', opacity: 0.6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {job.location}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: '#2563eb', fontWeight: 600 }}>₱{job.rate}/hr</span>
              <Button variant="secondary" size="sm">
                Contact Poster
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
