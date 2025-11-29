import React from 'react';
import type { Job } from '@/interfaces';

type JobCardProps = {
  job: Job;
  onApply?: (jobId: string) => void;
  onDelete?: (jobId: string) => void;
  showActions?: boolean;
};

export default function JobCard({ job, onApply, onDelete, showActions = false }: JobCardProps) {
  const handleApply = () => {
    if (onApply && job._id) {
      onApply(job._id);
    }
  };

  const handleDelete = () => {
    if (onDelete && job._id) {
      onDelete(job._id);
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--nav-bg)',
      borderColor: 'var(--border-color)',
      color: 'var(--text-color)'
    }} className="rounded-xl shadow-lg dark:shadow-xl p-6 hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 border hover:border-blue-300 dark:hover:border-blue-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 style={{ color: 'var(--text-color)' }} className="text-xl font-bold mb-1 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            {job.title}
          </h3>
          {job.category && (
            <span style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 500 }}>
              {job.category}
            </span>
          )}
        </div>
        <span className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-700 dark:text-blue-100 px-4 py-2 rounded-full text-sm font-bold shadow-sm dark:shadow-md">
          ₱{job.rate}/hr
        </span>
      </div>

      <p style={{ color: 'var(--text-color)', opacity: 0.8 }} className="mb-4 leading-relaxed line-clamp-3">
        {job.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">{job.location}</span>
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            {onApply && (
              <button
                onClick={handleApply}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Apply
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}