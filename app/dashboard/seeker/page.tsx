'use client';

import { useState } from 'react';
import { JOB_CATEGORIES } from '@/constants';
import Button from '@/components/1-atoms/Button';
import Input from '@/components/1-atoms/Input';
import styles from '../dashboard.module.css';
import type { Job } from '@/interfaces';

// Mock data for frontend-only
const MOCK_JOBS: Job[] = [
  { _id: '1', title: 'Garden Cleaning', description: 'Help maintain a beautiful garden. Weeding, trimming, and general cleanup needed.', category: 'Gardening', location: 'Makati City', rate: 250, status: 'open', posterId: 'p1', createdAt: new Date() },
  { _id: '2', title: 'House Painting', description: 'Interior painting for a 2-bedroom apartment. Paint and materials provided.', category: 'Repairs', location: 'Quezon City', rate: 300, status: 'open', posterId: 'p2', createdAt: new Date() },
  { _id: '3', title: 'Errands Helper', description: 'Looking for someone to help with various daily errands.', category: 'Errands', location: 'Taguig', rate: 200, status: 'open', posterId: 'p3', createdAt: new Date() },
  { _id: '4', title: 'Grocery Delivery', description: 'Need help with weekly grocery shopping and delivery.', category: 'Delivery', location: 'Pasig City', rate: 150, status: 'open', posterId: 'p4', createdAt: new Date() },
];

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

const selectStyles: React.CSSProperties = {
  padding: '0.75rem 1rem',
  borderRadius: 'var(--radius-md)',
  border: '1.5px solid var(--border-color)',
  backgroundColor: 'var(--page-bg)',
  color: 'var(--text-color)',
  minWidth: '180px',
  fontSize: '0.9375rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

export default function SeekerDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const handleSearch = () => {
    // Frontend-only: filter mock data locally
    let filtered = MOCK_JOBS;
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }
    setJobs(filtered);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleApply = (jobId: string) => {
    alert(`Applied to job ${jobId}`);
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Browse Jobs</h1>
        <p className={styles.pageDescription}>Find flexible work opportunities in your area</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8 p-4 bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--border-color)]">
        <div className="flex-1 min-w-[240px]">
          <Input
            placeholder="Search by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            leftIcon={<SearchIcon />}
            fullWidth
          />
        </div>
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
        <Button onClick={handleSearch} variant="primary" size="lg">
          Search Jobs
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[var(--primary-light)] border-t-[var(--primary)] rounded-full animate-spin" />
            <p className="text-[var(--text-muted)]">Finding opportunities...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-[var(--danger-light)] border border-[var(--danger)] rounded-[var(--radius-md)] text-[var(--danger)] text-center">
          {error}
        </div>
      )}

      {!isLoading && jobs.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <SearchIcon />
          </div>
          <h3 className={styles.emptyTitle}>No jobs found</h3>
          <p className={styles.emptyText}>Try adjusting your search filters or check back later</p>
        </div>
      )}

      <div className={styles.grid}>
        {jobs.map((job) => (
          <article key={job._id} className={styles.card}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-[var(--text-color)] mb-1 truncate">
                  {job.title}
                </h3>
                <span className="inline-block px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-xs font-semibold rounded-full">
                  {job.category}
                </span>
              </div>
              <div className="ml-3 px-3 py-1.5 bg-[var(--success-light)] text-[var(--success)] rounded-full text-sm font-bold whitespace-nowrap">
                ₱{job.rate}/hr
              </div>
            </div>

            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4 line-clamp-2">
              {job.description}
            </p>

            <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] mb-5">
              <LocationIcon />
              <span>{job.location}</span>
            </div>

            <Button onClick={() => handleApply(job._id)} variant="primary" fullWidth>
              Quick Apply
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
