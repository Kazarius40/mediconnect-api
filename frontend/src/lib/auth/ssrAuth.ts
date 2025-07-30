// src/lib/auth/ssrFetchUser.ts
import 'server-only';
import { cookies } from 'next/headers';
import { User } from '@/interfaces/user/user';

export const SSR_APP_URL =
  typeof window === 'undefined'
    ? process.env.INTERNAL_API_URL || 'http://nginx'
    : process.env.NEXT_PUBLIC_API_URL || '/api';

export async function ssrFetchUser(): Promise<{ user: User | null }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return { user: null };

  const res = await fetch(`${SSR_APP_URL}/api/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) return { user: null };

  const { user } = await res.json();
  return { user };
}
