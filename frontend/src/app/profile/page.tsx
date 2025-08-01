'use server';

import ProfilePageClient from '@/components/profile/ProfilePageClient';
import { cookies } from 'next/headers';
import { FRONTEND_URL } from '@/config/frontend';

export default async function ProfilePage() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) return <ProfilePageClient user={null} />;

    const profileRes = await fetch(`${FRONTEND_URL}/api/auth/profile`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    });

    const { user } = await profileRes.json();
    return <ProfilePageClient user={user} />;
  } catch (err) {
    console.error('Error in profile page:', err);
    return <ProfilePageClient user={null} />;
  }
}
