'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { USER_ROLES } from '@/constants';
import { signUp, usersService, notificationsService } from '@/lib/firebase';
import Header from '@/components/3-organisms/Header';
import Button from '@/components/1-atoms/Button';
import Input from '@/components/1-atoms/Input';
import styles from '../../forms.module.css';
import type { UserRole } from '@/interfaces';

type FormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
};

const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasNumber: /[0-9]/,
  hasSpecial: /[!@#$%^&*(),.?":{}|<>]/,
};

function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    return `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`;
  }
  if (!PASSWORD_REQUIREMENTS.hasUppercase.test(password)) {
    return 'Password must contain at least 1 uppercase letter';
  }
  if (!PASSWORD_REQUIREMENTS.hasNumber.test(password)) {
    return 'Password must contain at least 1 number';
  }
  if (!PASSWORD_REQUIREMENTS.hasSpecial.test(password)) {
    return 'Password must contain at least 1 special character (!@#$%^&*...)';
  }
  return null;
}

export default function SignUpPage() {
  const [form, setForm] = useState<FormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.SEEKER,
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

  const passwordError = validatePassword(form.password);
  const passwordChecks = {
    length: form.password.length >= PASSWORD_REQUIREMENTS.minLength,
    uppercase: PASSWORD_REQUIREMENTS.hasUppercase.test(form.password),
    number: PASSWORD_REQUIREMENTS.hasNumber.test(form.password),
    special: PASSWORD_REQUIREMENTS.hasSpecial.test(form.password),
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.username.trim()) {
      setError('Please enter your name');
      return;
    }

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const firebaseUser = await signUp(form.email, form.password, form.username);

      await usersService.create(firebaseUser.uid, {
        username: form.username,
        email: form.email,
        role: form.role as UserRole,
        profile: {
          ...(form.role === 'seeker' && { skills: [] }),
          completedJobs: 0,
          rating: 0,
        },
        createdAt: new Date(),
      });

      await notificationsService.create({
        userId: firebaseUser.uid,
        type: 'credentials',
        title: 'Welcome to Job Start!',
        message: `Your account has been created. Email: ${form.email}`,
      });

      setSuccess('Account created successfully!');
      const redirectPath = form.role === 'poster' ? '/dashboard/poster' : '/dashboard/seeker';
      setTimeout(() => router.push(redirectPath), 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      if (errorMessage.includes('email-already-in-use')) {
        setError('This email is already registered');
      } else if (errorMessage.includes('invalid-email')) {
        setError('Invalid email address');
      } else if (errorMessage.includes('weak-password')) {
        setError('Password is too weak');
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
              label="Full Name"
              type="text"
              name="username"
              placeholder="Your full name"
              value={form.username}
              onChange={handleChange}
              required
              fullWidth
            />

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
                placeholder="Min. 8 characters"
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

            {form.password && (
              <div className="p-3 bg-[var(--page-bg)] rounded-xl border border-[var(--border-color)]">
                <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Password requirements:</p>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span className={passwordChecks.length ? 'text-emerald-500' : 'text-[var(--text-muted)]'}>
                    {passwordChecks.length ? '✓' : '○'} 8+ characters
                  </span>
                  <span className={passwordChecks.uppercase ? 'text-emerald-500' : 'text-[var(--text-muted)]'}>
                    {passwordChecks.uppercase ? '✓' : '○'} 1 uppercase
                  </span>
                  <span className={passwordChecks.number ? 'text-emerald-500' : 'text-[var(--text-muted)]'}>
                    {passwordChecks.number ? '✓' : '○'} 1 number
                  </span>
                  <span className={passwordChecks.special ? 'text-emerald-500' : 'text-[var(--text-muted)]'}>
                    {passwordChecks.special ? '✓' : '○'} 1 special char
                  </span>
                </div>
              </div>
            )}

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
