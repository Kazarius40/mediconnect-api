import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await ssrFetchUser();

  console.log('AdminLayout user:', user);

  if (!user || user.role !== 'ADMIN') {
    console.log('Redirect to /auth/login from AdminLayout');
    redirect('/auth/login');
  }

  return (
    <div>
      <h1>Admin Layout Works!</h1>
      {children}
    </div>
  );
}
