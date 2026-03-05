'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const AdminRedirect = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      } else if (user.role === 'admin') {
        router.push('/admin/home');
      } else {
        router.push('/home');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-600">Redirecting...</p>
    </div>
  );
};

export default AdminRedirect;
