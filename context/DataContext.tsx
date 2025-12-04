'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  usersService,
  jobsService,
  applicationsService,
  reviewsService,
  notificationsService,
} from '@/lib/firebase';
import type { Notification } from '@/lib/firebase';
import type { Job, Application, Review, User } from '@/interfaces';
import { useAuth } from './AuthContext';

export type { Notification };

type DataContextType = {
  users: User[];
  jobs: Job[];
  applications: Application[];
  reviews: Review[];
  notifications: Notification[];
  isLoading: boolean;
  addUser: (user: User) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  getUserById: (id: string) => User | undefined;
  addJob: (job: Omit<Job, '_id'>) => Promise<string>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  getJobById: (id: string) => Job | undefined;
  getJobsByPosterId: (posterId: string) => Job[];
  getOpenJobs: () => Job[];
  addApplication: (application: Omit<Application, '_id'>) => Promise<string>;
  updateApplication: (id: string, updates: Partial<Application>) => Promise<void>;
  getApplicationsBySeekerId: (seekerId: string) => Application[];
  getApplicationsByJobId: (jobId: string) => Application[];
  getPendingApplicationsForPoster: (posterId: string) => Application[];
  addReview: (review: Omit<Review, '_id'>) => Promise<string>;
  getReviewsByRevieweeId: (revieweeId: string) => Review[];
  getReviewsByJobId: (jobId: string) => Review[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: (userId: string) => Promise<void>;
  clearAllNotifications: (userId: string) => Promise<void>;
  getNotificationsByUserId: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
  refreshJobs: () => Promise<void>;
  refreshApplications: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

type DataProviderProps = {
  children: ReactNode;
};

export function DataProvider({ children }: DataProviderProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setJobs([]);
      setIsLoading(false);
      return;
    }
    const unsubscribe = jobsService.subscribe((jobsData) => {
      setJobs(jobsData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const unsubscribe = notificationsService.subscribe(user.id, setNotifications);
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setApplications([]);
      return;
    }
    const loadApplications = async () => {
      if (user.role === 'seeker') {
        const apps = await applicationsService.getBySeeker(user.id);
        setApplications(apps);
      } else {
        const posterJobs = jobs.filter(j => j.posterId === user.id);
        const allApps: Application[] = [];
        for (const job of posterJobs) {
          const jobApps = await applicationsService.getByJob(job._id);
          allApps.push(...jobApps);
        }
        setApplications(allApps);
      }
    };
    loadApplications();
  }, [user, jobs]);

  useEffect(() => {
    if (!user) return;
    const loadReviews = async () => {
      const userReviews = await reviewsService.getByReviewee(user.id);
      setReviews(userReviews);
    };
    loadReviews();
  }, [user]);

  const refreshJobs = useCallback(async () => {
    const allJobs = await jobsService.getOpen();
    setJobs(allJobs);
  }, []);

  const refreshApplications = useCallback(async () => {
    if (!user) return;
    if (user.role === 'seeker') {
      const apps = await applicationsService.getBySeeker(user.id);
      setApplications(apps);
    }
  }, [user]);

  const addUser = useCallback(async (userData: User) => {
    await usersService.create(userData._id, userData);
    setUsers(prev => [...prev, userData]);
  }, []);

  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    await usersService.update(id, updates);
    setUsers(prev => prev.map(u => u._id === id ? { ...u, ...updates } : u));
  }, []);

  const getUserById = useCallback((id: string) => {
    const cached = users.find(u => u._id === id);
    if (cached) return cached;
    usersService.get(id).then(userData => {
      if (userData) setUsers(prev => [...prev.filter(u => u._id !== id), userData]);
    });
    return undefined;
  }, [users]);

  const addJob = useCallback(async (job: Omit<Job, '_id'>) => {
    const jobId = await jobsService.create(job);
    return jobId;
  }, []);

  const updateJob = useCallback(async (id: string, updates: Partial<Job>) => {
    await jobsService.update(id, updates);
  }, []);

  const deleteJob = useCallback(async (id: string) => {
    await jobsService.delete(id);
  }, []);

  const getJobById = useCallback((id: string) => jobs.find(j => j._id === id), [jobs]);

  const getJobsByPosterId = useCallback((posterId: string) => 
    jobs.filter(j => j.posterId === posterId), [jobs]);

  const getOpenJobs = useCallback(() => jobs.filter(j => j.status === 'open'), [jobs]);

  const addApplication = useCallback(async (application: Omit<Application, '_id'>) => {
    const appId = await applicationsService.create(application);
    const newApp = { ...application, _id: appId } as Application;
    setApplications(prev => [...prev, newApp]);
    await jobsService.update(application.jobId, {
      applicants: [...(jobs.find(j => j._id === application.jobId)?.applicants || []), application.seekerId]
    });
    return appId;
  }, [jobs]);

  const updateApplication = useCallback(async (id: string, updates: Partial<Application>) => {
    await applicationsService.update(id, updates);
    setApplications(prev => prev.map(a => a._id === id ? { ...a, ...updates } : a));
  }, []);

  const getApplicationsBySeekerId = useCallback((seekerId: string) => 
    applications.filter(a => a.seekerId === seekerId), [applications]);

  const getApplicationsByJobId = useCallback((jobId: string) => 
    applications.filter(a => a.jobId === jobId), [applications]);

  const getPendingApplicationsForPoster = useCallback((posterId: string) => {
    const posterJobIds = jobs.filter(j => j.posterId === posterId).map(j => j._id);
    return applications.filter(a => posterJobIds.includes(a.jobId) && a.status === 'pending');
  }, [jobs, applications]);

  const addReview = useCallback(async (review: Omit<Review, '_id'>) => {
    const reviewId = await reviewsService.create(review);
    const newReview = { ...review, _id: reviewId } as Review;
    setReviews(prev => [...prev, newReview]);
    
    const revieweeReviews = await reviewsService.getByReviewee(review.revieweeId);
    const avgRating = revieweeReviews.reduce((sum, r) => sum + r.rating, 0) / revieweeReviews.length;
    await usersService.update(review.revieweeId, {
      profile: {
        rating: Math.round(avgRating * 10) / 10,
      }
    });
    
    return reviewId;
  }, []);

  const getReviewsByRevieweeId = useCallback((revieweeId: string) => 
    reviews.filter(r => r.revieweeId === revieweeId), [reviews]);

  const getReviewsByJobId = useCallback((jobId: string) => 
    reviews.filter(r => r.jobId === jobId), [reviews]);

  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    await notificationsService.create(notification);
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    await notificationsService.markAsRead(id);
  }, []);

  const markAllNotificationsRead = useCallback(async (userId: string) => {
    await notificationsService.markAllAsRead(userId);
  }, []);

  const clearAllNotifications = useCallback(async (userId: string) => {
    await notificationsService.clearAll(userId);
  }, []);

  const getNotificationsByUserId = useCallback((userId: string) => 
    notifications.filter(n => n.userId === userId), [notifications]);

  const getUnreadCount = useCallback((userId: string) => 
    notifications.filter(n => n.userId === userId && !n.read).length, [notifications]);

  const value: DataContextType = {
    users,
    jobs,
    applications,
    reviews,
    notifications,
    isLoading,
    addUser,
    updateUser,
    getUserById,
    addJob,
    updateJob,
    deleteJob,
    getJobById,
    getJobsByPosterId,
    getOpenJobs,
    addApplication,
    updateApplication,
    getApplicationsBySeekerId,
    getApplicationsByJobId,
    getPendingApplicationsForPoster,
    addReview,
    getReviewsByRevieweeId,
    getReviewsByJobId,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    getNotificationsByUserId,
    getUnreadCount,
    refreshJobs,
    refreshApplications,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
