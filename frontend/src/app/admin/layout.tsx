'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authProvider } from '@/providers/AuthProvider';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = authProvider();
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
