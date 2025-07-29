import { redirect } from 'next/navigation';
import { getUserDetailsFromServer } from '@/lib/api';
import { User } from '@/interfaces/user/user';
import UserDetailsClient from '@/components/admin/UserDetailsClient';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.id);

  if (!userId) redirect('/admin/users');

  const authResult = await ssrFetchUser();
  const user = authResult.user;
  const token = authResult.accessToken;
  // const token = authResult.newAccessToken ?? null;

  if (!user || user.role !== 'ADMIN' || !token) {
    redirect('/admin/users');
  }

  let userDetails: User | null = null;
  try {
    userDetails = await getUserDetailsFromServer(token, userId);
  } catch (e) {
    console.error(e);
  }

  if (!userDetails) {
    return <p className="text-red-600 text-center mt-4">User not found</p>;
  }

  return <UserDetailsClient user={userDetails} />;
}
