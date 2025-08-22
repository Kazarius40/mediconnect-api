'use server';

import { cookies } from 'next/headers';
import { FRONTEND_URL } from '@/config/frontend';
import Table from '@/components/admin/users/Table';

export default async function UsersPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return <Table users={[]} />;
  }

  const usersRes = await fetch(`${FRONTEND_URL}/api/admin/users`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!usersRes.ok) {
    return <Table users={[]} />;
  }

  const { users } = await usersRes.json();
  return <Table users={users} />;
}
