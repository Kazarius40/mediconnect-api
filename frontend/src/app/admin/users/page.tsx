'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AdminUsersPageClient from '@/components/admin/AdminUsersClient';
import { FRONTEND_URL } from '@/config/frontend';

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const usersRes = await fetch(`${FRONTEND_URL}/api/users`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!usersRes.ok) {
    redirect('/');
  }

  const { users } = await usersRes.json();

  return <AdminUsersPageClient users={users} />;
}
