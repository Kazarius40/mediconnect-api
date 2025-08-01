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

  const res = await fetch(`${FRONTEND_URL}/api/auth/profile`, {
    headers: {
      cookie: `accessToken=${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) return { user: null };

  const { user } = await res.json();

  return { user };
}
