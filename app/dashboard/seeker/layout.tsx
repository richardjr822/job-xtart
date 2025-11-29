'use client';

import { ReactNode } from 'react';
import ProtectedRoute from '@/components/2-molecules/ProtectedRoute';

type SeekerLayoutProps = {
  children: ReactNode;
};

export default function SeekerLayout({ children }: SeekerLayoutProps) {
  return (
    <ProtectedRoute allowedRoles="seeker">
      {children}
    </ProtectedRoute>
  );
}
