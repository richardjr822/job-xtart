'use client';

import React, { useState, FormEvent } from 'react';
import Input from '../1-atoms/Input';
import Button from '../1-atoms/Button';

export interface SearchFormProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  buttonText?: string;
  isLoading?: boolean;
}

export default function SearchForm({
  onSearch,
  placeholder = 'Search jobs, locations, or keywords...',
  buttonText = 'Search',
  isLoading = false,
}: SearchFormProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  const searchIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        leftIcon={searchIcon}
        fullWidth
      />
      <Button type="submit" isLoading={isLoading} variant="primary">
        {buttonText}
      </Button>
    </form>
  );
}
