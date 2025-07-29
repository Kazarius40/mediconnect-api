import 'server-only';
import { cookies } from 'next/headers';
import { User } from '@/interfaces/user/user';

const SSR_APP_URL =
  typeof window === 'undefined'
    ? process.env.INTERNAL_API_URL || 'http://nginx'
    : process.env.NEXT_PUBLIC_API_URL || '/api';

interface SSRFetchUserResult {
  user: User | null;
  accessToken: string | null;
}

export async function hasRefreshToken(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get('refreshToken')?.value;
}

export async function ssrFetchUser(): Promise<SSRFetchUserResult> {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (!refreshToken) return { user: null, accessToken: null };

  try {
    const res = await fetch(`${SSR_APP_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return { user: null, accessToken: null };

    const { accessToken, user } = await res.json();

    console.log('accessToken', accessToken);
    return { user, accessToken };
  } catch (error) {
    console.error(
      'Server SSRFetchUser: Error fetching profile with access token:',
      error,
    );
  }

  return { user: null, accessToken: null };
}
