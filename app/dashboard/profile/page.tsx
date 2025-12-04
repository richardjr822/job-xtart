'use client';

import { useState, useEffect, FormEvent } from 'react';
import { SKILLS, BARANGAYS } from '@/constants';
import { useAuth, useData, useToast } from '@/context';
import Button from '@/components/1-atoms/Button';
import Input from '@/components/1-atoms/Input';
import Avatar from '@/components/1-atoms/Avatar';
import styles from '../dashboard.module.css';

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
];

export default function ProfilePage() {
  const { user } = useAuth();
  const { getUserById, updateUser, getReviewsByRevieweeId } = useData();
  const { showToast } = useToast();
  
  const currentUser = user ? getUserById(user.id) : null;
  const reviews = user ? getReviewsByRevieweeId(user.id) : [];
  
  const [form, setForm] = useState({
    username: '',
    avatar: '',
    bio: '',
    barangay: '',
    streetAddress: '',
    phone: '',
    hourlyRate: '',
    skills: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const locationParts = currentUser.profile.location?.split(', ') || ['', ''];
      setForm({
        username: currentUser.username || '',
        avatar: currentUser.profile.avatar || '',
        bio: currentUser.profile.bio || '',
        barangay: locationParts[1] || locationParts[0] || '',
        streetAddress: locationParts.length > 1 ? locationParts[0] : '',
        phone: currentUser.profile.phone || '',
        hourlyRate: currentUser.profile.hourlyRate?.toString() || '',
        skills: currentUser.profile.skills || [],
      });
    }
  }, [currentUser]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setForm({ ...form, phone: value });
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setForm({ ...form, hourlyRate: value });
  };

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);

    try {
      const location = form.streetAddress && form.barangay 
        ? `${form.streetAddress}, ${form.barangay}` 
        : form.barangay || form.streetAddress || '';

      const profileUpdate: Record<string, unknown> = {
        ...currentUser?.profile,
        avatar: form.avatar || '',
        bio: form.bio || '',
        location,
        phone: form.phone || '',
        skills: form.skills,
      };
      
      if (form.hourlyRate) {
        profileUpdate.hourlyRate = parseFloat(form.hourlyRate);
      }

      await updateUser(user.id, {
        username: form.username,
        profile: profileUpdate,
      });
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update profile:', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Profile</h1>
        <p className={styles.pageDescription}>
          {user?.role === 'seeker' ? 'Manage your personal information and skills' : 'Manage your profile and business information'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-1 space-y-4 lg:space-y-6">
          <div className={styles.card}>
            <div className="flex flex-col items-center text-center">
              <div className="relative group">
                <Avatar 
                  src={form.avatar} 
                  name={form.username || user?.email} 
                  size="xl"
                  className="ring-4 ring-[var(--primary-light)]"
                />
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-white text-xs font-medium">Change</span>
                </button>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--text-color)]">
                {currentUser?.username || 'User'}
              </h3>
              <p className="text-sm text-[var(--text-muted)] capitalize">{user?.role}</p>
              
              {showAvatarPicker && (
                <div className="mt-4 p-4 bg-[var(--page-bg)] rounded-xl border border-[var(--border-color)] animate-fadeIn w-full">
                  <p className="text-xs font-medium text-[var(--text-muted)] mb-3">Choose an avatar</p>
                  <div className="grid grid-cols-4 gap-2">
                    {AVATAR_OPTIONS.map((avatar, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, avatar });
                          setShowAvatarPicker(false);
                        }}
                        className={`p-1.5 rounded-lg border-2 transition-all hover:scale-105 ${
                          form.avatar === avatar
                            ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                            : 'border-transparent hover:border-[var(--border-color)]'
                        }`}
                      >
                        <Avatar src={avatar} size="sm" />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ ...form, avatar: '' });
                      setShowAvatarPicker(false);
                    }}
                    className="mt-3 text-xs text-[var(--text-muted)] hover:text-[var(--danger)]"
                  >
                    Use initials instead
                  </button>
                </div>
              )}
            </div>
          </div>

          {currentUser && (
            <div className={styles.card}>
              <h4 className="text-sm font-semibold text-[var(--text-color)] mb-4">Stats</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Rating</span>
                  <span className="text-lg font-bold text-[var(--warning)]">
                    ⭐ {currentUser.profile.rating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">
                    {user?.role === 'seeker' ? 'Jobs Completed' : 'Jobs Posted'}
                  </span>
                  <span className="text-lg font-bold text-[var(--success)]">
                    {currentUser.profile.completedJobs || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Reviews</span>
                  <span className="text-lg font-bold text-[var(--primary)]">
                    {reviews.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className={styles.card}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label="Full Name"
                placeholder="Your full name"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                fullWidth
              />

              <div>
                <label className="block mb-2 text-sm font-semibold text-[var(--text-color)]">
                  {user?.role === 'seeker' ? 'Bio' : 'About Your Business'}
                </label>
                <textarea
                  placeholder={user?.role === 'seeker' ? 'Tell us about yourself...' : 'Describe your business or the type of jobs you post...'}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-xl border-2 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] text-sm resize-none transition-all focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[var(--text-color)]">Barangay</label>
                  <select
                    value={form.barangay}
                    onChange={(e) => setForm({ ...form, barangay: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] text-sm transition-all focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]"
                  >
                    <option value="">Select Barangay</option>
                    {BARANGAYS.map((brgy) => (
                      <option key={brgy} value={brgy}>{brgy}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="House/Street No."
                  placeholder="e.g., 123 Main Street"
                  value={form.streetAddress}
                  onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
                  fullWidth
                />
              </div>

              <Input
                label="Phone Number"
                type="tel"
                placeholder="e.g., 09123456789"
                value={form.phone}
                onChange={handlePhoneChange}
                fullWidth
              />

              {user?.role === 'seeker' && (
                <>
                  <Input
                    label="Hourly Rate (₱)"
                    type="text"
                    inputMode="numeric"
                    placeholder="Your expected hourly rate"
                    value={form.hourlyRate}
                    onChange={handleRateChange}
                    fullWidth
                  />

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-[var(--text-color)]">Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {SKILLS.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            form.skills.includes(skill)
                              ? 'bg-[var(--primary)] text-white shadow-md'
                              : 'bg-[var(--button-secondary-bg)] text-[var(--text-muted)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                Save Profile
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
