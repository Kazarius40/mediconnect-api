'use server';

import { redirect } from 'next/navigation';
import { User } from '@/interfaces/user/user';
import { cookies } from 'next/headers';
import { FRONTEND_URL } from '@/config/frontend';
import UserDetailsComponent from '@/components/admin/UserDetailsComponent';

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const resolvedParams = await params;
  const userId = Number(resolvedParams.id);

  if (!userId) {
    redirect('/admin/users');
  }

  let userDetails: User | null = null;
  try {
    const res = await fetch(`${FRONTEND_URL}/api/users/${userId}`, {
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
    return <p className="text-red-600 text-center mt-4">User not found</p>;
  }

  return <UserDetailsComponent user={userDetails} />;
}
