'use client';

import VerifyEmailClient from '@/components/auth/VerifyEmailClient';
import { Suspense } from 'react';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading reset form...</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
