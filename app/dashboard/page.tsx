'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context';

export default function DashboardRedirect() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      router.replace('/auth/login');
      return;
    }

    const redirectPath = user.role === 'poster' 
      ? '/dashboard/poster' 
      : '/dashboard/seeker';
    router.replace(redirectPath);
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[var(--primary-light)] border-t-[var(--primary)] rounded-full animate-spin" />
        <p className="text-[var(--text-muted)]">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
