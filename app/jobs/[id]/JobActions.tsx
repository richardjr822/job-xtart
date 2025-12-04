'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/1-atoms/Button';

export default function JobActions() {
  const router = useRouter();

  const handleApply = () => {
    router.push('/auth/login?callbackUrl=/dashboard/seeker');
  };

  const handleSave = () => {
    router.push('/auth/login?callbackUrl=/dashboard/seeker');
  };

  return (
    <div className="space-y-3">
      <Button variant="primary" fullWidth onClick={handleApply}>
        Apply Now
      </Button>
      <Button variant="secondary" fullWidth onClick={handleSave}>
        Save for Later
      </Button>
    </div>
  );
}
