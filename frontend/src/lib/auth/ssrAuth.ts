import 'server-only';
import { cookies } from 'next/headers';
import { User } from '@/interfaces/user/user';

export const SSR_APP_URL =
  typeof window === 'undefined'
    ? process.env.INTERNAL_API_URL || 'http://nginx'
    : process.env.NEXT_PUBLIC_API_URL || '/api';

interface SSRFetchUserResult {
  user: User | null;
  accessToken: string | null;
}

export async function ssrFetchUser(): Promise<{ user: User | null }> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) return { user: null };

  try {
    const res = await fetch(`${SSR_APP_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return { user: null };

    const { user } = await res.json();
    return { user };
  } catch (err) {
    console.error('SSR Fetch failed:', err);
    return { user: null };
  }
}
