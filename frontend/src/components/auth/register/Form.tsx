'use client';

import React, { FormEvent, useState } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/api/client/auth';

const Form: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const passwordsMatch = password === confirmPassword;

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    try {
      await registerUser({ email, password });

      router.push(`/auth/email-sent?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Register</h1>

      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}

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

      <label>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full border p-2 rounded ${
            confirmPassword && !passwordsMatch ? 'border-red-500' : ''
          }`}
          required
        />
      </label>

      {!passwordsMatch && confirmPassword && (
        <div className="text-red-600">Passwords do not match</div>
      )}

      <button
        type="submit"
        disabled={!passwordsMatch || !password || !confirmPassword}
        className={`w-full p-2 rounded text-white ${
          !passwordsMatch || !password || !confirmPassword
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        Register
      </button>
    </form>
  );
};

export default Form;
