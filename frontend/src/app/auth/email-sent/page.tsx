'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import View from '@/components/auth/email-sent/View';

export default function EmailSent() {
  const searchParams = useSearchParams();

  const paramEmail = searchParams.get('email') ?? undefined;
  const [email, setEmail] = useState<string | undefined>(paramEmail);

  return (
    <View
      email={email ?? ''}
      manualEmailInput={!email}
      onEmailSubmit={setEmail}
    />
  );
}
