'use server';

import { cookies } from 'next/headers';
import { FRONTEND_URL } from '@/config/frontend';
import EditProfilePageComponent from '@/components/profile/EditProfilePageComponent';

export default async function EditProfilePage() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) return <EditProfilePageComponent user={null} />;

    const res = await fetch(`${FRONTEND_URL}/api/auth/profile`, {
      headers: { Cookie: `accessToken=${accessToken}` },
      cache: 'no-store',
    });

    if (!res.ok) return <EditProfilePageComponent user={null} />;

    const { user } = await res.json();

    return <EditProfilePageComponent user={user} />;
  } catch (error) {
    return <EditProfilePageComponent user={null} />;
  }
}
