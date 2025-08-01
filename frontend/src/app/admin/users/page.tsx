'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { FRONTEND_URL } from '@/config/frontend';
import UsersComponent from '@/components/admin/UsersComponent';

export default async function UsersPage() {
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

  return <UsersComponent users={users} />;
}
