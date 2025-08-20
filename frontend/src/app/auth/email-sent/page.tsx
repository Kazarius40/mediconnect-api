'use client';

import './style.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import EmailSentClient from '@/components/auth/EmailSentClient';

export default function EmailSentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get('email') ?? undefined;

  useEffect(() => {
    if (!email) {
      router.replace('/auth/register');
    }
  }, [email, router]);

  if (!email) {
    return <div className="redirect-text">Redirecting...</div>;
  }

  return <EmailSentClient email={email} />;
}
