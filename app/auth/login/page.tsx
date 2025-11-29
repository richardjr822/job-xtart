'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context';
import Header from '@/components/3-organisms/Header';
import Button from '@/components/1-atoms/Button';
import Input from '@/components/1-atoms/Input';
import styles from '../../forms.module.css';

type LoginForm = {
  email: string;
  password: string;
};

type LoginResponse = {
  user: {
    id: string;
    email: string;
    role: 'seeker' | 'poster';
  };
};

type ApiError = {
  status?: number;
  message?: string;
};

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const getRedirectPath = (role: 'seeker' | 'poster') => {
    if (callbackUrl && !callbackUrl.startsWith('/auth')) {
      return callbackUrl;
    }
    return role === 'poster' ? '/dashboard/poster' : '/dashboard/seeker';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Frontend-only: simulate login
    setTimeout(() => {
      const mockUser = {
        id: 'user-1',
        email: form.email,
        role: 'seeker' as const,
      };
      setUser(mockUser);
      setIsLoading(false);
      router.push(getRedirectPath(mockUser.role));
    }, 500);
  };

  return (
    <>
      <Header />
      <div className={styles.formContainer}>
        <div className={styles.formBox}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to continue to your dashboard</p>

          <form className={styles.form} onSubmit={handleSubmit}>
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

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
            />

            {error && (
              <div className="p-3 bg-[var(--danger-light)] border border-[var(--danger)] rounded-[var(--radius-md)] text-[var(--danger)] text-sm">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <p className={styles.link}>
            Don&apos;t have an account? <Link href="/auth/signup">Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
}
