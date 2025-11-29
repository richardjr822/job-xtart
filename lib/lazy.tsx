'use client';

import dynamic from 'next/dynamic';
import type { ComponentType, ReactNode } from 'react';

type DynamicLoadingProps = {
  error?: Error | null;
  isLoading?: boolean;
  pastDelay?: boolean;
  retry?: () => void;
  timedOut?: boolean;
};

type LazyLoadOptions = {
  loading?: () => ReactNode;
  ssr?: boolean;
};

function DefaultLoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-4 border-[var(--primary-light)] border-t-[var(--primary)] rounded-full animate-spin" />
    </div>
  );
}

export function lazyLoad<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyLoadOptions = {}
) {
  const { loading = DefaultLoadingSpinner, ssr = false } = options;

  return dynamic(importFn, {
    loading,
    ssr,
  });
}

export function lazyLoadWithSuspense<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback: ReactNode = <DefaultLoadingSpinner />
) {
  return dynamic(importFn, {
    loading: () => fallback,
    ssr: true,
  });
}

export const LazyHeader = lazyLoad(
  () => import('@/components/3-organisms/Header'),
  { ssr: true }
);
