'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useJobs, Job } from '@/hooks/useJob';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import JobCard from '@/components/3-organisms/JobCard';
import Button from '@/components/1-atoms/Button';
import Input from '@/components/1-atoms/Input';

export default function JobsTestPage() {
  const { jobs, isLoading, error, createJob } = useJobs();
  const { logout } = useAuthRequest();
  const router = useRouter();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const handleCreateJob = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createJob({ 
        title, 
        description, 
        location, 
        rate: Number(rate) 
      });
      alert('Job Created!');
      setTitle('');
      setDescription('');
      setLocation('');
      setRate('');
    } catch (err: any) {
      alert(`Failed to create job: ${err.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      router.push('/auth/login');
    } catch (err) {
      alert('Logout failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 py-8 px-4 relative">
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Confirm Logout</h2>
            <p className="mb-6 text-blue-700">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Job Board</h1>
            <p className="text-blue-600">Post and browse available jobs</p>
          </div>
          <Button variant="primary" onClick={() => setShowLogoutModal(true)}>
            Logout
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Post Job Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-blue-900">Post a Job</h2>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <Input
                label="Job Title"
                type="text"
                placeholder="e.g. Senior React Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
              />

              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe the job requirements and responsibilities..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none text-black"
                />
              </div>

              <Input
                label="Location"
                type="text"
                placeholder="e.g. Remote, New York, etc."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                fullWidth
              />

              <Input
                label="Hourly Rate ($)"
                type="number"
                placeholder="e.g. 50"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                required
                fullWidth
              />

              <Button type="submit" isLoading={isLoading} variant="primary" fullWidth>
                Post Job
              </Button>
            </form>
          </div>

          {/* Available Jobs */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-blue-900">Available Jobs</h2>
            </div>

            {isLoading && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-600 mt-3">Loading jobs...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-900">Error loading jobs</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && jobs.length === 0 && !error && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">No jobs found</h3>
                <p className="text-blue-600">Be the first to post a job!</p>
              </div>
            )}

            {jobs.map((job: Job) => (
              <JobCard key={job._id} job={job} showActions={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
