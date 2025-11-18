'use client';

import React, { ReactNode } from 'react';
import SearchForm from '../2-molecules/SearchForm';

export interface JobsPageTemplateProps {
  title: string;
  description?: string;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  headerActions?: ReactNode;
  children: ReactNode;
}

export default function JobsPageTemplate({
  title,
  description,
  onSearch,
  searchPlaceholder = 'Search jobs...',
  showSearch = false,
  headerActions,
  children,
}: JobsPageTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">{title}</h1>
            {description && <p className="text-blue-600">{description}</p>}
          </div>
          {headerActions && <div className="flex justify-center md:justify-end">{headerActions}</div>}
        </div>

        {/* Search Section */}
        {showSearch && onSearch && (
          <div className="mb-8 flex justify-center">
            <SearchForm onSearch={onSearch} placeholder={searchPlaceholder} />
          </div>
        )}

        {/* Main Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
