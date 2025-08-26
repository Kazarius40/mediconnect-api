'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import View from '@/components/auth/email-sent/View';

import './style.css';

export default function EmailSent() {
  const searchParams = useSearchParams();

  const paramEmail = searchParams.get('email') ?? undefined;
  const [email, setEmail] = useState<string | undefined>(paramEmail);

  useEffect(() => {
    if (!paramEmail) {
      setEmail(undefined);
    }
  }, [paramEmail]);

  if (!email) {
    return (
      <div className="email-sent">
        <h1 className="title">Resend Verification Email</h1>
        <p>Please enter your email to resend the verification link.</p>
        <View email="" manualEmailInput={true} onEmailSubmit={setEmail} />
      </div>
    );
  }

  return <View email={email} />;
}
