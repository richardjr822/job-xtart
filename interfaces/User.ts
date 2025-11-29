export type UserRole = 'seeker' | 'poster';

export interface UserProfile {
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  location?: string;
  phone?: string;
  photo?: string;
  rating?: number;
  completedJobs?: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  createdAt: Date;
}
