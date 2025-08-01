import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await ssrFetchUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  return <div>{children}</div>;
}
