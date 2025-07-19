'use client';

import { Suspense } from 'react';
import EmailSentClient from '@/components/auth/EmailSentClient';

export default function EmailSentPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <EmailSentClient />
    </Suspense>
  );
}
