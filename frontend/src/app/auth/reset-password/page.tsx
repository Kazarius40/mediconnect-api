'use client';

import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading reset form...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
