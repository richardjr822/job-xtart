"use client";

import { useMemo, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Job as DomainJob } from '@/interfaces';
import * as jobService from '@/services/jobService';

export type Job = DomainJob;
export type JobFilters = Record<string, unknown>;

export function useJobs(initialFilters: JobFilters = {}) {
  const [filters, setFilters] = useState<JobFilters>(initialFilters);
  const qc = useQueryClient();

  const key = useMemo(() => ['jobs', filters], [filters]);

  const { data, isPending, error, refetch } = useQuery({
    queryKey: key,
    queryFn: () => jobService.getJobs(filters),
  });

  const createMutation = useMutation({
    mutationFn: jobService.createJob,
    onSuccess: (created: Job) => {
      qc.setQueryData<Job[]>(key, (old: Job[] | undefined) => [created, ...(old || [])]);
    },
  });

  const createJob = useCallback((payload: jobService.JobInput) => createMutation.mutateAsync(payload), [createMutation]);

  return {
    jobs: (data || []) as Job[],
    isLoading: isPending || createMutation.isPending,
    error: (error as any)?.message || (createMutation.error as any)?.message || null,
    filters,
    setFilters,
    createJob,
    refreshJobs: refetch,
  };
}
