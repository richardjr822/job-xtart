import type { ReactNode } from 'react';
import Providers from '@/components/Providers';
import { defaultMetadata, viewport as defaultViewport } from '@/lib/seo';
import './globals.css';

export const metadata = defaultMetadata;
export const viewport = defaultViewport;

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
