'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { USER_ROLES } from '@/constants';
import Header from '@/components/3-organisms/Header';
import Button from '@/components/1-atoms/Button';
import Input from '@/components/1-atoms/Input';
import styles from '../../forms.module.css';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  phone: string;
};

type ApiError = {
  status?: number;
  message?: string;
};

export default function SignUpPage() {
  const [form, setForm] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.SEEKER,
    phone: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleRoleSelect = (role: string) => {
    setForm((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Frontend-only: simulate registration
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => router.push('/auth/login'), 1500);
    }, 500);
  };

  return (
    <>
      <Header />
      <div className={styles.formContainer}>
        <div className={styles.formBox}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join Job Start and find opportunities</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-semibold text-[var(--text-color)]">
                I want to:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect(USER_ROLES.SEEKER)}
                  className={`p-4 rounded-[var(--radius-md)] border-2 transition-all text-center ${
                    form.role === USER_ROLES.SEEKER
                      ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                      : 'border-[var(--border-color)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  <span className="block text-2xl mb-1">🔍</span>
                  <span className="font-semibold text-sm">Find Jobs</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect(USER_ROLES.POSTER)}
                  className={`p-4 rounded-[var(--radius-md)] border-2 transition-all text-center ${
                    form.role === USER_ROLES.POSTER
                      ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                      : 'border-[var(--border-color)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  <span className="block text-2xl mb-1">📋</span>
                  <span className="font-semibold text-sm">Post Jobs</span>
                </button>
              </div>
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                fullWidth
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                fullWidth
              />
            </div>

            <Input
              label="Phone (Optional)"
              type="tel"
              name="phone"
              placeholder="09123456789"
              value={form.phone}
              onChange={handleChange}
              fullWidth
            />

            {error && (
              <div className="p-3 bg-[var(--danger-light)] border border-[var(--danger)] rounded-[var(--radius-md)] text-[var(--danger)] text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-[var(--success-light)] border border-[var(--success)] rounded-[var(--radius-md)] text-[var(--success)] text-sm">
                {success}
              </div>
            )}

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <p className={styles.link}>
            Already have an account? <Link href="/auth/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
