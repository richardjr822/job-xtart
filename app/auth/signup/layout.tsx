import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Create Account',
  description: 'Join Job Start to find flexible work or post job opportunities in your community.',
  path: '/auth/signup',
});

type SignupLayoutProps = {
  children: ReactNode;
};

export default function SignupLayout({ children }: SignupLayoutProps) {
  return children;
}
