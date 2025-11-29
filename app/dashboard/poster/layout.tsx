'use client';

import { ReactNode } from 'react';
import ProtectedRoute from '@/components/2-molecules/ProtectedRoute';

type PosterLayoutProps = {
  children: ReactNode;
};

export default function PosterLayout({ children }: PosterLayoutProps) {
  return (
    <ProtectedRoute allowedRoles="poster">
      {children}
    </ProtectedRoute>
  );
}
