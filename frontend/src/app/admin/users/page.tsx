import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AdminUsersPageClient from '@/components/admin/AdminUsersClient';

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value ?? null;

  if (!refreshToken) {
    redirect('/auth/login');
  }

  return <AdminUsersPageClient />;
}
