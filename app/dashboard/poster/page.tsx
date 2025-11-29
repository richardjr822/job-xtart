'use client';

import { useState, FormEvent } from 'react';
import { JOB_CATEGORIES } from '@/constants';
import type { JobCategory } from '@/interfaces';
import Button from '@/components/1-atoms/Button';
import Input from '@/components/1-atoms/Input';
import styles from '../dashboard.module.css';

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const selectStyles: React.CSSProperties = {
  width: '100%',
  padding: '0.875rem 1rem',
  borderRadius: 'var(--radius-md)',
  border: '1.5px solid var(--border-color)',
  backgroundColor: 'var(--page-bg)',
  color: 'var(--text-color)',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const textareaStyles: React.CSSProperties = {
  width: '100%',
  padding: '0.875rem 1rem',
  borderRadius: 'var(--radius-md)',
  border: '1.5px solid var(--border-color)',
  backgroundColor: 'var(--page-bg)',
  color: 'var(--text-color)',
  fontSize: '1rem',
  resize: 'vertical',
  minHeight: '120px',
  fontFamily: 'inherit',
  transition: 'all 0.2s',
};

export default function PosterDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '' as JobCategory | '',
    location: '',
    rate: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!form.category) {
      alert('Please select a category');
      return;
    }

    // Frontend-only: simulate job creation
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setForm({ title: '', description: '', category: '', location: '', rate: '' });
    }, 500);
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Post a Job</h1>
        <p className={styles.pageDescription}>Create a new job listing to find the right person</p>
      </div>

      <div className={`${styles.card} max-w-2xl`}>
        {success && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-[var(--success-light)] border border-[var(--success)] rounded-[var(--radius-md)] text-[var(--success)]">
            <CheckIcon />
            <span className="font-medium">Job posted successfully! It's now visible to seekers.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Job Title"
            placeholder="e.g., Garden Cleaning, House Painting"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            fullWidth
          />

          <div>
            <label className="block mb-2 text-sm font-semibold text-[var(--text-color)]">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as JobCategory })}
              required
              style={selectStyles}
            >
              <option value="">Select a category</option>
              {JOB_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-[var(--text-color)]">
              Description
            </label>
            <textarea
              placeholder="Describe what needs to be done, any requirements, and what you're looking for..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={4}
              style={textareaStyles}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              placeholder="e.g., Makati City"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
              fullWidth
            />

            <Input
              label="Hourly Rate (PHP)"
              type="number"
              placeholder="e.g., 200"
              value={form.rate}
              onChange={(e) => setForm({ ...form, rate: e.target.value })}
              required
              fullWidth
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" fullWidth size="lg" isLoading={isLoading}>
              Publish Job Listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
