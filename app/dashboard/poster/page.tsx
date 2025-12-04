'use client';

import { useState, FormEvent } from 'react';
import { JOB_CATEGORIES, BARANGAYS } from '@/constants';
import { useAuth, useData, useToast } from '@/context';
import type { JobCategory } from '@/interfaces';
import Button from '@/components/1-atoms/Button';
import Input from '@/components/1-atoms/Input';
import styles from '../dashboard.module.css';

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
  const { user } = useAuth();
  const { addJob } = useData();
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '' as JobCategory | '',
    barangay: '',
    streetAddress: '',
    rate: '',
  });

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setForm({ ...form, rate: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.category) {
      showToast('Please select a category', 'warning');
      return;
    }

    if (!form.barangay) {
      showToast('Please select a barangay', 'warning');
      return;
    }

    if (!user) {
      showToast('Please log in to post a job', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const location = form.streetAddress && form.barangay 
        ? `${form.streetAddress}, ${form.barangay}` 
        : form.barangay;

      await addJob({
        posterId: user.id,
        title: form.title,
        description: form.description,
        category: form.category as JobCategory,
        location,
        rate: parseFloat(form.rate),
        status: 'open',
        applicants: [],
        createdAt: new Date(),
      });

      showToast('Job posted successfully!', 'success');
      setForm({ title: '', description: '', category: '', barangay: '', streetAddress: '', rate: '' });
    } catch (error) {
      console.error('Failed to post job:', error);
      showToast('Failed to post job', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Post a Job</h1>
        <p className={styles.pageDescription}>Create a new job listing to find the right person</p>
      </div>

      <div className={`${styles.card} max-w-2xl`}>
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
            <div>
              <label className="block mb-2 text-sm font-semibold text-[var(--text-color)]">Barangay</label>
              <select
                value={form.barangay}
                onChange={(e) => setForm({ ...form, barangay: e.target.value })}
                required
                style={selectStyles}
              >
                <option value="">Select Barangay</option>
                {BARANGAYS.map((brgy) => (
                  <option key={brgy} value={brgy}>{brgy}</option>
                ))}
              </select>
            </div>
            <Input
              label="House/Street No."
              placeholder="e.g., 123 Main Street"
              value={form.streetAddress}
              onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
              fullWidth
            />
          </div>

          <Input
            label="Hourly Rate (₱)"
            type="text"
            inputMode="numeric"
            placeholder="e.g., 200"
            value={form.rate}
            onChange={handleRateChange}
            required
            fullWidth
          />

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
