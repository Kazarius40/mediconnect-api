'use client';

import React, { FormEvent, useState } from 'react';
import { AxiosError } from 'axios';
import api from '@/api/axios';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setResetLink(null);

    try {
      const res = await api.post('/auth/forgot-password', { email });

      setMessage(res.data.message);

      if (res.data.resetToken) {
        document.cookie = `resetToken=${res.data.resetToken}; path=/`;
        setResetLink('/auth/reset-password');
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Forgot Password</h1>

      {message && <div className="text-green-600">{message}</div>}
      {error && <div className="text-red-600">{error}</div>}

      <label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Send Reset Link
      </button>

      {resetLink && (
        <p className="mt-4 break-all">
          Reset link:{' '}
          <a
            href={resetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {resetLink}
          </a>
        </p>
      )}
    </form>
  );
};

export default ForgotPasswordForm;
