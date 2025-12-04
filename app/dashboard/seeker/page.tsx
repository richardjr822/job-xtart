'use client';

import { useState, useMemo } from 'react';
import { JOB_CATEGORIES } from '@/constants';
import { useAuth, useData } from '@/context';
import Button from '@/components/1-atoms/Button';
import Input from '@/components/1-atoms/Input';
import styles from '../dashboard.module.css';
import type { JobCategory } from '@/interfaces';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const selectStyles: React.CSSProperties = {
  padding: '0.625rem 0.75rem',
  borderRadius: 'var(--radius-md)',
  border: '1.5px solid var(--border-color)',
  backgroundColor: 'var(--page-bg)',
  color: 'var(--text-color)',
  width: '100%',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

export default function SeekerDashboard() {
  const { user } = useAuth();
  const { getOpenJobs, addApplication, getApplicationsBySeekerId, addNotification, getJobById, getUserById } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const openJobs = getOpenJobs();
  const myApplications = user ? getApplicationsBySeekerId(user.id) : [];
  const appliedJobIds = myApplications.map(a => a.jobId);

  const filteredJobs = useMemo(() => {
    let filtered = openJobs;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query)
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }
    return filtered;
  }, [openJobs, searchQuery, selectedCategory]);

  const handleApplyClick = (jobId: string) => {
    setApplyingTo(jobId);
    setMessage('');
    setShowModal(true);
  };

  const handleSubmitApplication = async () => {
    if (!user || !applyingTo) return;

    const job = getJobById(applyingTo);
    if (!job) return;

    await addApplication({
      jobId: applyingTo,
      seekerId: user.id,
      status: 'pending',
      message: message.trim() || '',
      createdAt: new Date(),
    });

    await addNotification({
      userId: job.posterId,
      type: 'application_received',
      title: 'New Application Received',
      message: `${user.username || user.email} applied for "${job.title}"`,
      data: { jobId: job._id, seekerId: user.id },
    });

    setShowModal(false);
    setApplyingTo(null);
    setMessage('');
  };

  const applyingJob = applyingTo ? getJobById(applyingTo) : null;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Browse Jobs</h1>
        <p className={styles.pageDescription}>Find flexible work opportunities in your area</p>
      </div>

      <div className="flex flex-col gap-3 mb-4 p-3 bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--border-color)] sm:mb-6 sm:p-4 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<SearchIcon />}
            fullWidth
          />
        </div>
        <div className="sm:w-48 md:w-44 lg:w-52">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={selectStyles}
          >
            <option value="">All Categories</option>
            {JOB_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredJobs.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <SearchIcon />
          </div>
          <h3 className={styles.emptyTitle}>No jobs found</h3>
          <p className={styles.emptyText}>Try adjusting your search filters or check back later</p>
        </div>
      )}

      <div className={styles.grid}>
        {filteredJobs.map((job) => {
          const hasApplied = appliedJobIds.includes(job._id);
          const poster = getUserById(job.posterId);
          
          return (
            <article key={job._id} className={styles.card}>
              <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:justify-between sm:items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-[var(--text-color)] mb-1 sm:text-lg line-clamp-1">
                    {job.title}
                  </h3>
                  <span className="inline-block px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-xs font-semibold rounded-full">
                    {job.category}
                  </span>
                </div>
                <div className="self-start px-2.5 py-1 bg-[var(--success-light)] text-[var(--success)] rounded-full text-sm font-bold whitespace-nowrap sm:ml-2">
                  ₱{job.rate}/hr
                </div>
              </div>

              <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-3 line-clamp-2">
                {job.description}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-1.5 sm:text-sm">
                <LocationIcon />
                <span>{job.location}</span>
              </div>

              {poster && (
                <p className="text-xs text-[var(--text-muted)] mb-3">
                  Posted by {poster.username}
                </p>
              )}

              {hasApplied ? (
                <div className="flex items-center justify-center gap-2 py-2 bg-[var(--success-light)] text-[var(--success)] rounded-[var(--radius-md)] font-medium text-sm">
                  <CheckIcon />
                  Applied
                </div>
              ) : (
                <Button onClick={() => handleApplyClick(job._id)} variant="primary" fullWidth size="sm">
                  Quick Apply
                </Button>
              )}
            </article>
          );
        })}
      </div>

      {showModal && applyingJob && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 sm:items-center sm:p-4">
          <div className="bg-[var(--card-bg)] rounded-t-[var(--radius-lg)] p-4 w-full max-h-[85vh] overflow-y-auto shadow-xl sm:rounded-[var(--radius-lg)] sm:max-w-md sm:p-6">
            <h2 className="text-lg font-semibold text-[var(--text-color)] mb-1.5 sm:text-xl sm:mb-2">
              Apply for {applyingJob.title}
            </h2>
            <p className="text-[var(--text-muted)] text-xs mb-3 sm:text-sm sm:mb-4">
              {applyingJob.category} • ₱{applyingJob.rate}/hr • {applyingJob.location}
            </p>
            
            <div className="mb-3 sm:mb-4">
              <label className="block mb-1.5 text-sm font-semibold text-[var(--text-color)] sm:mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell the employer why you're a good fit..."
                rows={3}
                className="w-full p-2.5 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--page-bg)] text-[var(--text-color)] text-sm resize-none focus:outline-none focus:border-[var(--primary)] sm:p-3 sm:rows-4"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <Button variant="ghost" onClick={() => setShowModal(false)} fullWidth>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmitApplication} fullWidth>
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
