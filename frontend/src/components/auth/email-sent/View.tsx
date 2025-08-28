'use client';

import { FormEvent, useState } from 'react';
import { resendVerification } from '@/api/client/auth';
import { AxiosError } from 'axios';

import './style.css';

type Status = '' | 'loading' | 'success' | 'error';

interface ViewProps {
  email: string;
  manualEmailInput?: boolean;
  onEmailSubmit?: (email: string) => void;
}

export default function View({
  email: initialEmail,
  manualEmailInput,
  onEmailSubmit,
}: ViewProps) {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<Status>('');
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(false);

  const handleResend = async () => {
    if (cooldown || !email) return;

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

  const handleSubmitEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      if (onEmailSubmit) onEmailSubmit(email);
      await handleResend();
    }
  };

  const isDisabled = status === 'loading' || cooldown || !email;

  return (
    <div className="email-card">
      {manualEmailInput ? (
        <form onSubmit={handleSubmitEmail} className="email-form">
          <label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
          </label>

          <button
            type="submit"
            disabled={!email || isDisabled}
            className={`submit-btn ${isDisabled ? 'disabled' : 'enabled'}`}
          >
            {status === 'loading' ? 'Sending...' : 'Send Verification Email'}
          </button>
        </form>
      ) : (
        <>
          <h1 className="title">Verify your email</h1>
          <div className="email-info">
            <span>
              We sent a verification link to <strong>{email}</strong>.
            </span>
            <span>Please check your inbox (and spam folder).</span>
          </div>
          <button
            onClick={handleResend}
            disabled={isDisabled}
            className={`submit-btn ${isDisabled ? 'disabled' : 'enabled'}`}
          >
            {status === 'loading'
              ? 'Resending...'
              : cooldown
                ? 'Please wait...'
                : 'Resend Verification Email'}
          </button>

          {message && <div className={`message ${status}`}>{message}</div>}

          <p className="hint">
            Didn’t get the email? Check your spam folder or click resend.
          </p>
        </>
      )}
    </div>
  );
}
