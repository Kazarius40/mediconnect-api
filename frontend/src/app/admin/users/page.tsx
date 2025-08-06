'use server';

import { cookies } from 'next/headers';
import { FRONTEND_URL } from '@/config/frontend';
import UsersComponent from '@/components/admin/UsersComponent';

export default async function UsersPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return <UsersComponent users={[]} />;
  }

  const usersRes = await fetch(`${FRONTEND_URL}/api/users`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!usersRes.ok) {
    return <UsersComponent users={[]} />;
  }

  const { users } = await usersRes.json();
  return <UsersComponent users={users} />;
}
