'use client';

import Link from 'next/link';
import './style.css';

interface VerifyEmailProps {
  status: 'success' | 'error';
  message: string;
}

export default function EmailVerificationStatus({
  status,
  message,
}: VerifyEmailProps) {
  return (
    <div className="email-verification-status">
      {status === 'success' ? (
        <>
          <div className="message success">{message}</div>
          <Link href="/auth/login" className="btn primary">
            Go to Login
          </Link>
        </>
      ) : (
        <>
          <div className="message error">{message}</div>
          <Link href="/auth/login" className="btn secondary">
            Back to Login
          </Link>
        </>
      )}
    </div>
  );
}
