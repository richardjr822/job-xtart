'use client';

import { ReactNode } from 'react';
import { useRequireAuth } from '@/context';
import type { UserRole } from '@/interfaces';

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: UserRole | UserRole[];
  fallback?: ReactNode;
};

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[var(--primary-light)] border-t-[var(--primary)] rounded-full animate-spin" />
      <p className="text-[var(--text-muted)] font-medium">Loading...</p>
    </div>
  </div>
);

const AccessDenied = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
    <div className="text-center p-8 max-w-md">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--danger-light)] flex items-center justify-center">
        <svg className="w-8 h-8 text-[var(--danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-[var(--text-color)] mb-2">Access Denied</h2>
      <p className="text-[var(--text-muted)]">You don&apos;t have permission to access this page.</p>
    </div>
  </div>
);

export default function ProtectedRoute({
  children,
  allowedRoles,
  fallback,
}: ProtectedRouteProps) {
  const { isLoading, isAuthorized } = useRequireAuth(allowedRoles);

  if (isLoading) {
    return fallback ?? <LoadingSpinner />;
  }

  if (!isAuthorized) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
