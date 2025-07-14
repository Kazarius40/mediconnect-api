'use client';

import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';

export function useUser(requireAuth = false) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !loading && !user) {
      router.push('/auth/login');
    }
  }, [requireAuth, loading, user, router]);

  return { user, loading };
}
