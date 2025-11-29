export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type JobCategory = 'Repairs' | 'Gardening' | 'Tutoring' | 'Delivery' | 'Errands' | 'Cleaning' | 'Moving' | 'Other';

export interface Job {
  _id: string;
  posterId: string;
  title: string;
  description: string;
  category: JobCategory;
  location: string;
  rate: number;
  status: JobStatus;
  assignedTo?: string;
  applicants?: string[];
  createdAt: Date;
  completedAt?: Date;
}