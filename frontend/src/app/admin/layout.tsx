'use client';

import React, { ReactNode, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useUser(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.replace('/');
    }
  }, [loading, user, router]);

  if (loading) return <p>Loading...</p>;

  if (user?.role !== 'ADMIN') return null;

  return <>{children}</>;
}
