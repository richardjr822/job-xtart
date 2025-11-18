import React from 'react';
import { Job } from '@/hooks/useJob';

export interface JobCardProps {
  job: Job & {
    company?: string;
    salary?: number;
  };
  onApply?: (jobId: string) => void;
  onDelete?: (jobId: string) => void;
  showActions?: boolean;
}

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
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300">
      {/* Header with Title and Rate */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-blue-900 mb-1 hover:text-blue-700 transition-colors">
            {job.title}
          </h3>
          {job.company && (
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {job.company}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
            ${job.rate}/hr
          </span>
          {job.salary && (
            <span className="text-xs text-gray-500">
              Salary: ${job.salary.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
        {job.description}
      </p>

      {/* Footer with Location and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-blue-600">
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
                className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
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