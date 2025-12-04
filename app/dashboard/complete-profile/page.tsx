'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useData } from '@/context';
import { SKILLS, BARANGAYS } from '@/constants';
import Button from '@/components/1-atoms/Button';
import Input from '@/components/1-atoms/Input';
import Avatar from '@/components/1-atoms/Avatar';

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

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { getUserById, updateUser } = useData();
  
  const currentUser = user ? getUserById(user.id) : null;
  
  const [form, setForm] = useState({
    avatar: '',
    bio: '',
    barangay: '',
    streetAddress: '',
    phone: '',
    hourlyRate: '',
    skills: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (currentUser?.profileCompleted) {
      const path = user?.role === 'poster' ? '/dashboard/poster' : '/dashboard/seeker';
      router.replace(path);
    }
  }, [currentUser, user, router]);

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setForm({ ...form, phone: value });
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setForm({ ...form, hourlyRate: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);

    try {
      const location = form.streetAddress && form.barangay 
        ? `${form.streetAddress}, ${form.barangay}` 
        : form.barangay || form.streetAddress || '';

      const profileData: Record<string, unknown> = {
        ...currentUser?.profile,
        avatar: form.avatar || '',
        bio: form.bio || '',
        location,
        phone: form.phone || '',
        skills: form.skills,
      };

      if (form.hourlyRate) {
        profileData.hourlyRate = parseFloat(form.hourlyRate);
      }

      await updateUser(user.id, {
        profileCompleted: true,
        profile: profileData,
      });

      const path = user.role === 'poster' ? '/dashboard/poster' : '/dashboard/seeker';
      router.push(path);
    } catch (error) {
      console.error('Failed to complete profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSeeker = user?.role === 'seeker';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--page-bg)] via-[var(--card-bg)] to-[var(--page-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-color)] mb-2">
            Complete Your Profile
          </h1>
          <p className="text-[var(--text-muted)]">
            {step === 1 ? 'Choose your avatar' : 'Tell us about yourself'}
          </p>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`w-12 h-1.5 rounded-full transition-colors ${
                  s <= step ? 'bg-[var(--primary)]' : 'bg-[var(--border-color)]'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-center mb-4">
                  <Avatar
                    src={form.avatar}
                    name={user?.username}
                    size="xl"
                    className="ring-4 ring-[var(--primary-light)]"
                  />
                </div>

                <p className="text-center text-sm text-[var(--text-muted)]">
                  Select an avatar for your profile
                </p>

                <div className="grid grid-cols-4 gap-3">
                  {AVATAR_OPTIONS.map((avatar, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setForm({ ...form, avatar })}
                      className={`p-2 rounded-xl border-2 transition-all hover:scale-105 ${
                        form.avatar === avatar
                          ? 'border-[var(--primary)] bg-[var(--primary-light)] shadow-lg'
                          : 'border-[var(--border-color)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      <Avatar src={avatar} size="md" className="mx-auto" />
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    onClick={() => {
                      setForm({ ...form, avatar: '' });
                      setStep(2);
                    }}
                  >
                    Use Initials
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    fullWidth
                    onClick={() => setStep(2)}
                    disabled={!form.avatar}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <Input
                  label={isSeeker ? 'Bio' : 'About Your Business'}
                  placeholder={isSeeker ? 'Tell us a bit about yourself...' : 'Describe your business or the type of jobs you post...'}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  fullWidth
                />

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

                {isSeeker && (
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
                      <label className="block mb-2.5 text-sm font-semibold text-[var(--text-color)]">
                        Skills
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
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

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isLoading}
                  >
                    Complete Setup
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
