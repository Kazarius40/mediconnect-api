'use server';

import { ssrFetchUser } from '@/lib/auth/ssrAuth';
import Details from '@/components/profile/Details';

export default async function Profile() {
  try {
    const { user } = await ssrFetchUser();
    return <Details user={user} />;
  } catch (err) {
    console.error('Error in profile page:', err);
    return <Details user={null} />;
  }
}
