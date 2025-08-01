'use server';

import ProfilePageComponent from '@/components/profile/ProfileComponent';
import ProfileComponent from '@/components/profile/ProfileComponent';
import { cookies } from 'next/headers';
import { FRONTEND_URL } from '@/config/frontend';

export default async function ProfilePage() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) return <ProfilePageComponent user={null} />;

    const profileRes = await fetch(`${FRONTEND_URL}/api/auth/profile`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!profileRes.ok) return <ProfilePageComponent user={null} />;

    const { user } = await profileRes.json();
    return <ProfilePageComponent user={user} />;
  } catch (err) {
    console.error('Error in profile page:', err);
    return <ProfileComponent user={null} />;
  }
}
