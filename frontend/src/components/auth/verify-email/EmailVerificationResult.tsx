'use client';

import Link from 'next/link';
import './style.css';

interface VerifyEmailProps {
  status: 'success' | 'error';
  message: string;
}

export default function EmailVerificationResult({
  status,
  message,
}: VerifyEmailProps) {
  return (
    <div className="email-verification-status">
      <div className={`message ${status}`}>{message}</div>
      {status === 'success' ? (
        <Link href="/auth/login" className="button enabled">
          Go to Login
        </Link>
      ) : (
        <Link href="/auth/email-sent" className="button enabled">
          Resend Verification Email
        </Link>
      )}
    </div>
  );
}
