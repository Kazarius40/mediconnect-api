'use server';

import { cookies } from 'next/headers';
import { FRONTEND_URL } from '@/config/frontend';
import Edit from '@/components/profile/Edit';

export default async function EditProfile() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) return <Edit user={null} />;

    const res = await fetch(`${FRONTEND_URL}/api/auth/profile`, {
      headers: { Cookie: `accessToken=${accessToken}` },
      cache: 'no-store',
    });

    if (!res.ok) return <Edit user={null} />;

    const { user } = await res.json();

    return <Edit user={user} />;
  } catch (error) {
    return <Edit user={null} />;
  }
}
