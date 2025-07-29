'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfilePageClient from '@/components/profile/ProfilePageClient';
import { hasRefreshToken } from '@/lib/auth/ssrAuth';

export default async function ProfilePage() {
  const hasToken = await hasRefreshToken();

  if (!hasToken) {
    redirect('/');
  }

  return <ProfilePageClient />;
}
