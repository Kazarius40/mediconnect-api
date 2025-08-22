'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AxiosError } from 'axios';
import { resetPassword } from '@/api/client/auth';

import './style.css';

export default function Form() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
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
    setSuccess(null);

    if (!token) {
      setError('Missing reset token');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await resetPassword({ token, password });
      setSuccess(res.data.message);
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reset-password-form">
      <h1 className="form-title">Reset Password</h1>

      {success && <div className="message success">{success}</div>}
      {error && <div className="message error">{error}</div>}

      <label>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
      </label>

      <label>
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="input-field"
          required
        />
      </label>

      <button type="submit" className="submit-btn">
        Change Password
      </button>
    </form>
  );
}
