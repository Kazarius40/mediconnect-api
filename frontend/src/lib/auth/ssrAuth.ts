import 'server-only';
import { cookies } from 'next/headers';
import { User } from '@/interfaces/user/user';
import { FRONTEND_URL } from '@/config/frontend';

export async function ssrFetchUser(): Promise<{ user: User | null }> {
  const cookieStore = await cookies();

  if (cookieStore.get('authInvalid')) {
    return { user: null };
  }

  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return { user: null };

  const profileRes = await fetch(`${FRONTEND_URL}/api/auth/profile`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!profileRes.ok) return { user: null };

  const { user } = await profileRes.json();

  return { user };
}
