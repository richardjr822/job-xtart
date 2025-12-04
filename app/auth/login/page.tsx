'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn, usersService } from '@/lib/firebase';
import Header from '@/components/3-organisms/Header';
import Button from '@/components/1-atoms/Button';
import Input from '@/components/1-atoms/Input';
import styles from '../../forms.module.css';

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      const firebaseUser = await signIn(form.email, form.password);
      const userData = await usersService.get(firebaseUser.uid);

      if (userData) {
        router.push(getRedirectPath(userData.role));
      } else {
        setError('User data not found. Please contact support.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      if (errorMessage.includes('user-not-found') || errorMessage.includes('wrong-password') || errorMessage.includes('invalid-credential')) {
        setError('Invalid email or password');
      } else if (errorMessage.includes('invalid-email')) {
        setError('Invalid email address');
      } else if (errorMessage.includes('too-many-requests')) {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
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
