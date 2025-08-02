'use server';

import ProfilePageComponent from '@/components/profile/ProfileComponent';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';

export default async function ProfilePage() {
  try {
    const { user } = await ssrFetchUser();
    return <ProfilePageComponent user={user} />;
  } catch (err) {
    console.error('Error in profile page:', err);
    return <ProfilePageComponent user={null} />;
  }
}
