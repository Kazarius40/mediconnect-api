'use client';

import './style.css';
import { useState } from 'react';
import { resendVerification } from '@/api/client/auth';
import { AxiosError } from 'axios';

export default function View({ email }: { email: string }) {
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
      const res = await resendVerification({ email });
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

  return (
    <div className="email-sent">
      <h1 className="title">Verify your email</h1>

      <p>
        We sent a verification link to <strong>{email}</strong>.<br />
        Please check your inbox (and spam folder).
      </p>

      {message && <div className={`message ${status}`}>{message}</div>}

      <button
        onClick={handleResend}
        disabled={status === 'loading' || cooldown}
        className="resend-btn"
      >
        {status === 'loading'
          ? 'Resending...'
          : cooldown
            ? 'Please wait...'
            : 'Resend Verification Email'}
      </button>

      <p className="hint">
        Didn’t get the email? Check your spam folder or click resend.
      </p>
    </div>
  );
}
