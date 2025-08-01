'use server';

import { cookies } from 'next/headers';
import { FRONTEND_URL } from '@/config/frontend';
import EditProfileComponent from '@/components/profile/EditProfileComponent';

export default async function EditProfilePage() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) return <EditProfileComponent user={null} />;

    const res = await fetch(`${FRONTEND_URL}/api/auth/profile`, {
      headers: { Cookie: `accessToken=${accessToken}` },
      cache: 'no-store',
    });

    if (!res.ok) return <EditProfileComponent user={null} />;

    const { user } = await res.json();

    return <EditProfileComponent user={user} />;
  } catch (error) {
    return <EditProfileComponent user={null} />;
  }
}
