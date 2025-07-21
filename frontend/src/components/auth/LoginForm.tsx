'use client';

import React, { FormEvent, useState } from 'react';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { setCookie } from '@/utils/cookies/cookies.util';
import { login, resendVerification } from '@/api/auth';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await login({ email, password });
      const { accessToken } = response.data;

      if (accessToken) {
        setCookie('accessToken', accessToken, {
          sameSite: 'Lax',
          maxAge: 3600,
        });

        window.location.href = '/profile';
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const msg = axiosError.response?.data?.message || 'Login failed';
      setError(msg);

      if (msg.includes('verify your email')) {
        setShowResend(true);
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>

      {error && <div className="text-red-600">{error}</div>}

      {showResend && (
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={async () => {
              try {
                const res = await resendVerification(email);
                setError(res.data.message || 'Verification email resent');
                setShowResend(false);
              } catch (err) {
                const axiosError = err as AxiosError<{ message: string }>;
                setError(
                  axiosError.response?.data?.message || 'Failed to resend',
                );
              }
            }}
            className="text-blue-600 hover:underline cursor-pointer transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-100"
          >
            Resend verification email
          </button>
        </div>
      )}

      <label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Log In
      </button>

      <p className="text-sm text-center">
        <Link
          href="/auth/forgot-password"
          className="text-blue-600 hover:underline"
        >
          Forgot your password?
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
