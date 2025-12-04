import type { Job } from '@/interfaces';

const API_BASE_URL = 'https://dummyjson.com';

export type JobInput = {
  title: string;
  description: string;
  location: string;
  rate: number;
};

export async function createJob(job: JobInput): Promise<Job> {
  const res = await fetch(`${API_BASE_URL}/posts/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: job.title, body: job.description, userId: 1 }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create job');
  const now = new Date();
  return {
    _id: String(data.id),
    posterId: 'api',
    title: job.title,
    description: job.description,
    category: 'Other',
    location: job.location || 'Remote',
    rate: job.rate,
    status: 'open',
    applicants: [],
    createdAt: now,
  } as Job;
}

export async function getJobs(filters: Record<string, unknown> = {}): Promise<Job[]> {
  const res = await fetch(`${API_BASE_URL}/posts?limit=50`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch jobs');
  const now = new Date();
  const mapped: Job[] = (data.posts || []).map((p: any) => ({
    _id: String(p.id),
    posterId: 'api',
    title: p.title,
    description: p.body,
    category: 'Other',
    location: 'Remote',
    rate: 20 + (p.id % 80),
    status: 'open',
    applicants: [],
    createdAt: now,
  }));
  return mapped;
}
