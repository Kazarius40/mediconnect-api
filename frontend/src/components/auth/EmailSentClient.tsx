'use client';

import { useState } from 'react';
import { resendVerification } from '@/api/client/auth';
import { AxiosError } from 'axios';

export default function EmailSentClient({ email }: { email: string }) {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(false);

  const handleResend = async () => {
    if (cooldown) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await resendVerification(email);
      setMessage(res.data.message || 'Verification email resent successfully!');
      setStatus('success');

      setCooldown(true);
      setTimeout(() => setCooldown(false), 5000);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setMessage(
        axiosError.response?.data?.message || 'Failed to resend email',
      );
      setStatus('error');
    }
  };

  const getMessageColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'loading':
        return 'text-gray-600';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-md mx-auto text-center mt-20 space-y-4">
      <h1 className="text-2xl font-bold">Verify your email</h1>

      <p>
        We sent a verification link to <strong>{email}</strong>.<br />
        Please check your inbox (and spam folder).
      </p>

      {message && <div className={getMessageColor()}>{message}</div>}

      <button
        onClick={handleResend}
        disabled={status === 'loading' || cooldown}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {status === 'loading'
          ? 'Resending...'
          : cooldown
            ? 'Please wait...'
            : 'Resend Verification Email'}
      </button>

      <p className="text-sm text-gray-500 mt-4">
        Didn’t get the email? Check your spam folder or click resend.
      </p>
    </div>
  );
}
