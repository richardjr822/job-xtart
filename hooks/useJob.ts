import { useState, useEffect, useCallback } from 'react';
import * as jobService from '../services/jobService';

export interface Job {
  _id?: string;
  title: string;
  description: string;
  location: string;
  rate: number;
  [key: string]: any;
}

export interface JobFilters {
  [key: string]: any;
}

export interface UseJobsResult {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  filters: JobFilters;
  setFilters: React.Dispatch<React.SetStateAction<JobFilters>>;
  createJob: (jobData: Job) => Promise<Job>;
  refreshJobs: () => Promise<void>;
}

export const useJobs = (initialFilters: JobFilters = {}): UseJobsResult => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>(initialFilters);

  // Function to fetch jobs
  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await jobService.getJobs(filters);
      setJobs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const createJob = async (jobData: Job): Promise<Job> => {
    setIsLoading(true);
    setError(null);
    try {
      const newJob = await jobService.createJob(jobData);
      await fetchJobs();
      return newJob;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    jobs,
    isLoading,
    error,
    filters,
    setFilters, 
    createJob,
    refreshJobs: fetchJobs,
  };
};