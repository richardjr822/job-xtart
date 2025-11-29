import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/3-organisms/Header';
import Button from '@/components/1-atoms/Button';
import { generateJobMetadata } from '@/lib/seo';
import type { Job } from '@/interfaces';

// Mock data for frontend-only
const MOCK_JOBS: Job[] = [
  { _id: '1', title: 'Garden Cleaning', description: 'Help maintain a beautiful garden. Weeding, trimming, and general cleanup needed. This is a great opportunity for someone who enjoys outdoor work and has experience with landscaping or gardening.', category: 'Gardening', location: 'Makati City', rate: 250, status: 'open', posterId: 'p1', createdAt: new Date() },
  { _id: '2', title: 'House Painting', description: 'Interior painting for a 2-bedroom apartment. Paint and materials provided. Looking for someone with attention to detail.', category: 'Repairs', location: 'Quezon City', rate: 300, status: 'open', posterId: 'p2', createdAt: new Date() },
  { _id: '3', title: 'Errands Helper', description: 'Looking for someone to help with various daily errands including shopping, delivery, and other tasks.', category: 'Errands', location: 'Taguig', rate: 200, status: 'open', posterId: 'p3', createdAt: new Date() },
  { _id: '4', title: 'Grocery Delivery', description: 'Need help with weekly grocery shopping and delivery. Must have own transportation.', category: 'Delivery', location: 'Pasig City', rate: 150, status: 'open', posterId: 'p4', createdAt: new Date() },
  { _id: '5', title: 'Tutoring - Math', description: 'High school math tutoring for Grade 10 student. 2 hours per session. Must be patient and good at explaining concepts.', category: 'Tutoring', location: 'Manila', rate: 350, status: 'open', posterId: 'p5', createdAt: new Date() },
  { _id: '6', title: 'Moving Help', description: 'Assistance needed for moving furniture to a new apartment. Heavy lifting required.', category: 'Moving', location: 'Mandaluyong', rate: 280, status: 'open', posterId: 'p6', createdAt: new Date() },
];

function getJobById(id: string): Job | undefined {
  return MOCK_JOBS.find(job => job._id === id);
}

type PageParams = {
  id: string;
};

type JobPageProps = {
  params: Promise<PageParams>;
};

export function generateStaticParams() {
  return MOCK_JOBS.map((job) => ({ id: job._id }));
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    return { title: 'Job Not Found' };
  }

  return generateJobMetadata({
    id: job._id,
    title: job.title,
    description: job.description,
    location: job.location,
    rate: job.rate,
  });
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

export default async function JobDetailsPage({ params }: JobPageProps) {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <nav className="mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
          >
            <BackIcon />
            <span>Back to Jobs</span>
          </Link>
        </nav>

        <article itemScope itemType="https://schema.org/JobPosting">
          <header className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1
                itemProp="title"
                className="text-3xl font-bold text-[var(--text-color)]"
              >
                {job.title}
              </h1>
              <span className="shrink-0 px-4 py-2 text-sm font-semibold rounded-full bg-[var(--success-light)] text-[var(--success)] capitalize">
                {job.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-2" itemProp="jobLocation" itemScope itemType="https://schema.org/Place">
                <LocationIcon />
                <span itemProp="name">{job.location}</span>
              </span>
              <span className="flex items-center gap-2">
                <ClockIcon />
                <time itemProp="datePosted" dateTime={new Date(job.createdAt).toISOString()}>
                  Posted {formattedDate}
                </time>
              </span>
              <span className="flex items-center gap-2">
                <TagIcon />
                <span itemProp="occupationalCategory">{job.category}</span>
              </span>
            </div>
          </header>

          <div className="grid gap-8 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <div className="bg-[var(--nav-bg)] border border-[var(--border-color)] rounded-xl p-6">
                <h2 className="text-xl font-semibold text-[var(--text-color)] mb-4">
                  Job Description
                </h2>
                <div
                  itemProp="description"
                  className="prose prose-sm max-w-none text-[var(--text-color)] opacity-90 whitespace-pre-wrap"
                >
                  {job.description}
                </div>
              </div>
            </section>

            <aside className="lg:col-span-1">
              <div className="bg-[var(--nav-bg)] border border-[var(--border-color)] rounded-xl p-6 sticky top-24">
                <div className="mb-6">
                  <span className="text-sm text-[var(--text-muted)]">Hourly Rate</span>
                  <div
                    itemProp="baseSalary"
                    itemScope
                    itemType="https://schema.org/MonetaryAmount"
                    className="text-3xl font-bold text-[var(--primary)]"
                  >
                    <span itemProp="currency" content="PHP">₱</span>
                    <span itemProp="value">{job.rate}</span>
                    <span className="text-lg font-normal text-[var(--text-muted)]">/hr</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {}}
                  >
                    Apply Now
                  </Button>
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => {}}
                  >
                    Save for Later
                  </Button>
                </div>

                <p className="mt-4 text-xs text-center text-[var(--text-muted)]">
                  Sign in to apply for this job
                </p>
              </div>
            </aside>
          </div>
        </article>
      </main>
    </div>
  );
}
