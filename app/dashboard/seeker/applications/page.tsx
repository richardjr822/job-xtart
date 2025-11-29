'use client';

import { useState } from 'react';
import styles from '../../dashboard.module.css';
import type { Application } from '@/interfaces';

// Mock data for frontend-only
const MOCK_APPLICATIONS: Application[] = [
  { _id: 'a1', jobId: '1', seekerId: 'user-1', status: 'pending', message: 'I am very interested in this position.', createdAt: new Date() },
  { _id: 'a2', jobId: '3', seekerId: 'user-1', status: 'accepted', message: 'Available to start immediately.', createdAt: new Date() },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'rgba(234, 179, 8, 0.1)', text: '#ca8a04' },
  accepted: { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a' },
  rejected: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626' },
  withdrawn: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' },
};

export default function MyApplications() {
  const [applications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [isLoading] = useState(false);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Applications</h1>
        <p className={styles.pageDescription}>Track your job applications</p>
      </div>

      {isLoading && <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>}

      {!isLoading && applications.length === 0 && (
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
          return (
            <div key={app._id} className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-color)', marginBottom: '0.25rem' }}>
                    Job #{app.jobId?.substring(0, 8)}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-color)', opacity: 0.6 }}>
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span style={{ backgroundColor: status.bg, color: status.text, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
                  {app.status}
                </span>
              </div>

              {app.message && (
                <p style={{ color: 'var(--text-color)', opacity: 0.7, fontSize: '0.875rem', fontStyle: 'italic' }}>
                  "{app.message}"
                </p>
              )}

              {app.status === 'accepted' && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', fontSize: '0.875rem', color: '#16a34a' }}>
                  🎉 You've been hired! Check Active Jobs for details.
                </div>
              )}

              {app.status === 'rejected' && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', fontSize: '0.875rem', color: '#dc2626', opacity: 0.8 }}>
                  This application was not accepted.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
