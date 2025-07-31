'use server';

import ProfilePageClient from '@/components/profile/ProfilePageClient';
import { BACKEND_URL } from '@/config/backend';
import { cookies } from 'next/headers';

export default async function ProfilePage() {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get('refreshToken')?.value;
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!refreshToken || !accessToken) return <ProfilePageClient user={null} />;
    if (accessToken) {
    }
    const profileRes = await fetch(`${BACKEND_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (profileRes.status === 401) {
      const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      if (!refreshRes.ok) return <ProfilePageClient user={null} />;

      const { accessToken: newAccessToken } = await refreshRes.json();

      const profileAfterRefresh = await fetch(`${BACKEND_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
        cache: 'no-store',
      });

      if (!profileAfterRefresh.ok) return <ProfilePageClient user={null} />;

      const user = await profileAfterRefresh.json();
      return <ProfilePageClient user={user} />;
    }

    const user = await profileRes.json();
    return <ProfilePageClient user={user} />;
  } catch (err) {
    console.error('SSR error in profile page:', err);
    return <ProfilePageClient user={null} />;
  }
}
