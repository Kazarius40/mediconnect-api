'use server';

import './style.css';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { FRONTEND_URL } from '@/config/frontend';
import Details from '@/components/admin/user/Details';
import { User } from '@/interfaces/user';

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const userId = Number((await params).id);

  if (!userId) {
    redirect('/admin/users');
  }

  let userDetails: User | null = null;
  try {
    const res = await fetch(`${FRONTEND_URL}/api/admin/users/${userId}`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      userDetails = json.user;
    }
  } catch (e) {
    console.error('Fetch user by ID failed:', e);
  }

  if (!userDetails) {
    return <p className="error-message">User not found</p>;
  }

  return <Details user={userDetails} />;
}
