'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AxiosError } from 'axios';
import { resetPassword } from '@/api/client/auth';

import './style.css';

export default function Form() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const passwordsMatch = password === confirmPassword;
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Missing reset token');
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Missing reset token');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    try {
      await resetPassword({ token, password });
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Reset failed');
    }
  };
  const isDisabled = !password || !passwordsMatch || !token;

  return (
    <form onSubmit={handleSubmit} className="reset-password-form">
      <h1 className="title">Reset Password</h1>

      <label>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
        />
      </label>

      <label>
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`input ${confirmPassword && !passwordsMatch ? 'input--error' : ''}`}
          required
        />
      </label>

      {error && <div className="message error">{error}</div>}
      {!passwordsMatch && confirmPassword && (
        <div className="message error">Passwords do not match</div>
      )}

      <button
        type="submit"
        disabled={isDisabled}
        className={`submit-btn  ${isDisabled ? 'disabled' : 'enabled'}`}
      >
        Change Password
      </button>
    </form>
  );
}
