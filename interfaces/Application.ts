export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export interface Application {
  _id: string;
  jobId: string;
  seekerId: string;
  message?: string;
  status: ApplicationStatus;
  createdAt: Date;
  respondedAt?: Date;
}
