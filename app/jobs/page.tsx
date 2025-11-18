'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useJobs, Job } from '@/hooks/useJob';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import JobsHeader from '@/components/3-organisms/JobsHeader';
import JobCard from '@/components/3-organisms/JobCard';
import Button from '@/components/1-atoms/Button';
import Input from '@/components/1-atoms/Input';
import styles from '@/app/forms.module.css';

export default function JobsTestPage() {
  const { jobs, isLoading, error, createJob } = useJobs();
  const router = useRouter();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'post' | 'my-posts'>('post');

  const handleCreateJob = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createJob({ 
        title, 
        description, 
        location, 
        rate: Number(rate) 
      });
      alert('Job Created!');
      setTitle('');
      setDescription('');
      setLocation('');
      setRate('');
      // Switch to My Posts tab to show the newly created job
      setActiveTab('my-posts');
    } catch (err: any) {
      alert(`Failed to create job: ${err.message}`);
    }
  };

  return (
    <div className={styles.formContainer}>
      <JobsHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Post Job Tab */}
      {activeTab === 'post' && (
        <div className={styles.formBox} style={{ maxWidth: '600px', marginTop: '20px', marginBottom: '40px' }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className={styles.title} style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>Post a New Job</h2>
            <p className="text-center mb-6" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Fill in the details below to create a job listing</p>
          </div>

          <form onSubmit={handleCreateJob} className={styles.form}>
            {/* Title Input */}
            <div className={styles.formGroup}>
              <Input
                label="Job Title"
                type="text"
                placeholder="e.g. Garderner"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
              />
              <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', opacity: 0.6, color: 'var(--text-color)' }}>Make it clear and descriptive so job seekers understand the role</p>
            </div>

            {/* Description Textarea */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Job Description</label>
              <textarea
                placeholder="Describe the job requirements, responsibilities, and any other relevant information..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                className={styles.input}
                style={{ padding: '0.75rem 1rem', fontFamily: 'inherit', minHeight: '150px' }}
              />
              <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', opacity: 0.6, color: 'var(--text-color)' }}>Provide detailed information about what the job do</p>
            </div>

            {/* Location Input */}
            <div className={styles.formGroup}>
              <Input
                label="Location"
                type="text"
                placeholder="e.g. # Street Address, Barangay, City"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                fullWidth
              />
              <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', opacity: 0.6, color: 'var(--text-color)' }}>Specify it's location</p>
            </div>

            {/* Rate Input */}
            <div className={styles.formGroup}>
              <Input
                label="Hourly Rate (PHP)"
                type="number"
                placeholder="e.g. ₱200"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                required
                fullWidth
              />
              <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', opacity: 0.6, color: 'var(--text-color)' }}>Enter the hourly rate you're willing to pay</p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              isLoading={isLoading} 
              variant="primary" 
              fullWidth
              className={styles.button}
            >
              Post Job
            </Button>

            {/* Form Info */}
            <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-color)' }}>
                <span style={{ fontWeight: 600 }}>💡 Tip:</span> Clear and detailed job postings get better responses from qualified candidates.
              </p>
            </div>
          </form>
        </div>
      )}

      {/* My Posts Tab */}
      {activeTab === 'my-posts' && (
        <div style={{ maxWidth: '900px', marginTop: '40px', width: '100%' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-color)' }}>My Posts</h2>
          </div>

          {isLoading && (
            <div style={{ backgroundColor: 'var(--nav-bg)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', padding: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'inline-block', width: '2rem', height: '2rem', borderWidth: '4px', borderStyle: 'solid', borderColor: '#2563eb', borderTopColor: 'transparent', borderRadius: '100%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ color: 'var(--text-color)', marginTop: '0.75rem', opacity: 0.7 }}>Loading jobs...</p>
            </div>
          )}

          {error && (
            <div style={{ backgroundColor: '#fef2f2', borderRadius: '12px', padding: '1.5rem', border: '1px solid #fecaca' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <svg className="w-6 h-6" style={{ color: '#dc2626', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p style={{ fontWeight: 600, color: '#7f1d1d' }}>Error loading jobs</p>
                  <p style={{ fontSize: '0.875rem', color: '#b91c1c', marginTop: '0.25rem' }}>{error}</p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && jobs.length === 0 && !error && (
            <div style={{ backgroundColor: 'var(--nav-bg)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: '4rem', height: '4rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <svg className="w-8 h-8" style={{ color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-color)', marginBottom: '0.5rem' }}>No jobs found</h3>
              <p style={{ color: 'var(--text-color)', opacity: 0.7 }}>Be the first to post a job!</p>
            </div>
          )}

          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem', marginBottom: '4rem' }}>
            {jobs.map((job: Job) => (
              <JobCard key={job._id} job={job} showActions={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
