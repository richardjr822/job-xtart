import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/3-organisms/Header';
import { generatePageMetadata } from '@/lib/seo';
import { JOB_CATEGORIES } from '@/constants';
import type { Job } from '@/interfaces';

// Mock data for frontend-only
const MOCK_JOBS: Job[] = [
  { _id: '1', title: 'Garden Cleaning', description: 'Help maintain a beautiful garden. Weeding, trimming, and general cleanup needed.', category: 'Gardening', location: 'Makati City', rate: 250, status: 'open', posterId: 'p1', createdAt: new Date() },
  { _id: '2', title: 'House Painting', description: 'Interior painting for a 2-bedroom apartment. Paint and materials provided.', category: 'Repairs', location: 'Quezon City', rate: 300, status: 'open', posterId: 'p2', createdAt: new Date() },
  { _id: '3', title: 'Errands Helper', description: 'Looking for someone to help with various daily errands.', category: 'Errands', location: 'Taguig', rate: 200, status: 'open', posterId: 'p3', createdAt: new Date() },
  { _id: '4', title: 'Grocery Delivery', description: 'Need help with weekly grocery shopping and delivery.', category: 'Delivery', location: 'Pasig City', rate: 150, status: 'open', posterId: 'p4', createdAt: new Date() },
  { _id: '5', title: 'Tutoring - Math', description: 'High school math tutoring for Grade 10 student. 2 hours per session.', category: 'Tutoring', location: 'Manila', rate: 350, status: 'open', posterId: 'p5', createdAt: new Date() },
  { _id: '6', title: 'Moving Help', description: 'Assistance needed for moving furniture to a new apartment.', category: 'Moving', location: 'Mandaluyong', rate: 280, status: 'open', posterId: 'p6', createdAt: new Date() },
];

export const metadata: Metadata = generatePageMetadata({
  title: 'Browse Jobs',
  description: 'Find flexible, short-term jobs in your community. Browse available positions and apply today.',
  path: '/jobs',
});

type SearchParams = {
  category?: string;
  location?: string;
  q?: string;
};

type JobsPageProps = {
  searchParams: Promise<SearchParams>;
};

function JobCardSkeleton() {
  return (
    <div className="bg-[var(--nav-bg)] border border-[var(--border-color)] rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-[var(--border-color)] rounded w-3/4 mb-4" />
      <div className="h-4 bg-[var(--border-color)] rounded w-full mb-2" />
      <div className="h-4 bg-[var(--border-color)] rounded w-2/3 mb-4" />
      <div className="flex justify-between">
        <div className="h-4 bg-[var(--border-color)] rounded w-1/4" />
        <div className="h-4 bg-[var(--border-color)] rounded w-1/4" />
      </div>
    </div>
  );
}

function JobsList({ searchParams }: { searchParams: SearchParams }) {
  // Frontend-only: filter mock data
  let jobs = MOCK_JOBS.filter(job => job.status === 'open');
  if (searchParams.category) {
    jobs = jobs.filter(job => job.category === searchParams.category);
  }
  if (searchParams.location) {
    jobs = jobs.filter(job => job.location.toLowerCase().includes(searchParams.location!.toLowerCase()));
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[var(--text-color)] mb-2">No jobs found</h3>
        <p className="text-[var(--text-muted)]">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <article
          key={job._id}
          className="bg-[var(--nav-bg)] border border-[var(--border-color)] rounded-xl p-6 hover:border-[var(--primary)] transition-colors"
        >
          <Link href={`/jobs/${job._id}`} className="block">
            <h3 className="text-lg font-semibold text-[var(--text-color)] mb-2 hover:text-[var(--primary)]">
              {job.title}
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
              {job.description}
            </p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-muted)]">{job.location}</span>
              <span className="text-[var(--primary)] font-semibold">₱{job.rate}/hr</span>
            </div>
            <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
                {job.category}
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

function CategoryFilter() {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/jobs"
        className="px-4 py-2 text-sm font-medium rounded-full bg-[var(--primary)] text-white"
      >
        All
      </Link>
      {JOB_CATEGORIES.map((category) => (
        <Link
          key={category}
          href={`/jobs?category=${encodeURIComponent(category)}`}
          className="px-4 py-2 text-sm font-medium rounded-full bg-[var(--button-secondary-bg)] text-[var(--text-color)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors"
        >
          {category}
        </Link>
      ))}
    </div>
  );
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-color)] mb-2">
            Browse Available Jobs
          </h1>
          <p className="text-[var(--text-muted)]">
            Find flexible work opportunities in your community
          </p>
        </header>

        <section aria-label="Job categories" className="mb-8">
          <Suspense fallback={<div className="h-10 bg-[var(--border-color)] rounded animate-pulse w-64" />}>
            <CategoryFilter />
          </Suspense>
        </section>

        <section aria-label="Job listings">
          <Suspense
            fallback={
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <JobsList searchParams={params} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
