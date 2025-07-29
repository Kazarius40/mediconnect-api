import { BACKEND_URL } from '@/config/backend';

export async function verifyEmail(token: string) {
  const res = await fetch(`${BACKEND_URL}/auth/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Verification failed');
  }

  return (await res.json()) as Promise<{ message: string }>;
}
