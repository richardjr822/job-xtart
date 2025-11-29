'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { SKILLS } from '@/constants';
import Button from '@/components/1-atoms/Button';
import Input from '@/components/1-atoms/Input';
import styles from '@/app/forms.module.css';

export default function ProfilePage() {
  const [form, setForm] = useState({
    bio: '',
    location: '',
    phone: '',
    hourlyRate: '',
    skills: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setSuccess(true);
    setIsLoading(false);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formBox} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className={styles.title}>Edit Profile</h1>
          <Link href="/dashboard/seeker" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem' }}>
            ← Back to Dashboard
          </Link>
        </div>

        {success && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', marginBottom: '1.5rem', color: '#16a34a' }}>
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Bio</label>
            <textarea
              placeholder="Tell us about yourself..."
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className={styles.input}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          <div className={styles.formGroup}>
            <Input
              label="Location"
              placeholder="e.g., Makati City"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              fullWidth
            />
          </div>

          <div className={styles.formGroup}>
            <Input
              label="Phone"
              type="tel"
              placeholder="e.g., 09123456789"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              fullWidth
            />
          </div>

          <div className={styles.formGroup}>
            <Input
              label="Hourly Rate (PHP)"
              type="number"
              placeholder="Your expected hourly rate"
              value={form.hourlyRate}
              onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
              fullWidth
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Skills</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '999px',
                    border: '1px solid',
                    borderColor: form.skills.includes(skill) ? '#2563eb' : 'var(--border-color)',
                    backgroundColor: form.skills.includes(skill) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    color: form.skills.includes(skill) ? '#2563eb' : 'var(--text-color)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
            Save Profile
          </Button>
        </form>
      </div>
    </div>
  );
}
