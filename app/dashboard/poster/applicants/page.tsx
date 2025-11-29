'use client';

import { useState } from 'react';
import { APPLICATION_STATUS } from '@/constants';
import Button from '@/components/1-atoms/Button';
import styles from '../../dashboard.module.css';
import type { Application } from '@/interfaces';

// Mock data for frontend-only
const MOCK_APPLICATIONS: Application[] = [
  { _id: 'a1', jobId: '1', seekerId: 'seeker-123', status: 'pending', message: 'I have 3 years of gardening experience.', createdAt: new Date() },
  { _id: 'a2', jobId: '2', seekerId: 'seeker-456', status: 'pending', message: 'Professional painter available.', createdAt: new Date() },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'rgba(234, 179, 8, 0.1)', text: '#ca8a04' },
  accepted: { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a' },
  rejected: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626' },
  withdrawn: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' },
};

export default function Applicants() {
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [isLoading] = useState(false);

  const handleAccept = async (id: string) => {
    if (confirm('Accept this applicant?')) {
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status: APPLICATION_STATUS.ACCEPTED } : app));
    }
  };

  const handleReject = async (id: string) => {
    if (confirm('Reject this applicant?')) {
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status: APPLICATION_STATUS.REJECTED } : app));
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Applicants</h1>
        <p className={styles.pageDescription}>Review and manage job applications</p>
      </div>

      {isLoading && <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>}

      {!isLoading && applications.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>No applicants yet</h3>
          <p className={styles.emptyText}>Applications will appear here</p>
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
                    Applicant #{app.seekerId?.substring(0, 8)}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-color)', opacity: 0.6 }}>
                    Job #{app.jobId?.substring(0, 8)}
                  </span>
                </div>
                <span style={{ backgroundColor: status.bg, color: status.text, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
                  {app.status}
                </span>
              </div>

              {app.message && (
                <p style={{ color: 'var(--text-color)', opacity: 0.7, marginBottom: '1rem', fontSize: '0.875rem', fontStyle: 'italic' }}>
                  "{app.message}"
                </p>
              )}

              <p style={{ fontSize: '0.75rem', color: 'var(--text-color)', opacity: 0.5, marginBottom: '1rem' }}>
                Applied {new Date(app.createdAt).toLocaleDateString()}
              </p>

              {app.status === APPLICATION_STATUS.PENDING && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button onClick={() => handleAccept(app._id)} variant="primary" size="sm">
                    Accept
                  </Button>
                  <Button onClick={() => handleReject(app._id)} variant="danger" size="sm">
                    Reject
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
