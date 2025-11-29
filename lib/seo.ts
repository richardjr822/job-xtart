import type { Metadata, Viewport } from 'next';

const SITE_CONFIG = {
  name: 'Job Start',
  description: 'Find flexible work in your community. No resumes, no long applications. Just real work, right now.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://jobstart.com',
  locale: 'en_US',
  twitter: '@jobstart',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: ['jobs', 'employment', 'flexible work', 'gig economy', 'local jobs', 'community work'],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    creator: SITE_CONFIG.twitter,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

type PageMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function generatePageMetadata({
  title,
  description,
  path = '',
  image,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const pageUrl = `${SITE_CONFIG.url}${path}`;
  const pageDescription = description || SITE_CONFIG.description;
  const pageImage = image || '/og-image.png';

  return {
    title,
    description: pageDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description: pageDescription,
      url: pageUrl,
      images: [{ url: pageImage }],
    },
    twitter: {
      title,
      description: pageDescription,
      images: [pageImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export function generateJobMetadata(job: {
  title: string;
  description: string;
  location: string;
  rate: number;
  id: string;
}): Metadata {
  const truncatedDesc = job.description.length > 160
    ? `${job.description.substring(0, 157)}...`
    : job.description;

  return generatePageMetadata({
    title: `${job.title} - ${job.location}`,
    description: `${truncatedDesc} | ₱${job.rate}/hr`,
    path: `/jobs/${job.id}`,
  });
}
