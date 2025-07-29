'use server';

import ProfilePageClient from '@/components/profile/ProfilePageClient';
import { User } from '@/interfaces/user/user';
import { FRONTEND_URL } from '@/config/frontend';
import { cookies } from 'next/headers';

export default async function ProfilePage() {
  let user: User | null = null;

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const res = await fetch(`${FRONTEND_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      user = data.user;
    } else {
      console.warn('API /api/profile failed with status:', res.status);
    }
  } catch (error) {
    console.error('Error fetching user from /api/profile:', error);
  }

  return <ProfilePageClient user={user} />;
}
