'use server';

import { FRONTEND_URL } from '@/config/frontend';
import EmailVerificationStatus from '@/components/auth/verify-email/EmailVerificationStatus';

export default async function VerifyEmailPage(props: {
  searchParams: Promise<{ token?: string }>;
}) {
  const searchParams = await props.searchParams;
  const token = searchParams?.token;

  if (!token) {
    return (
      <EmailVerificationStatus
        status="error"
        message="Missing verification token"
      />
    );
  }

  let status: 'success' | 'error' = 'success';
  let message: string;

  try {
    const res = await fetch(`${FRONTEND_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ token }),
    });

    const data = (await res.json()) as { message: string };

    if (!res.ok) {
      status = 'error';
      message = data?.message ?? 'Verification failed';
    } else {
      message = data?.message ?? 'Email verified successfully!';
    }
  } catch (err) {
    status = 'error';
    message = (err as Error).message ?? 'Verification failed';
  }

  return <EmailVerificationStatus status={status} message={message} />;
}
