'use client';

import React, { FormEvent, useState } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/api/client/auth';

import './style.css';

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
    <form onSubmit={handleRegister} className="register-form">
      <h1 className="form-title">Register</h1>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      <label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
      </label>

      <label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
      </label>

      <label>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`input-field ${confirmPassword && !passwordsMatch ? 'input-error' : ''}`}
          required
        />
      </label>

      {!passwordsMatch && confirmPassword && (
        <div className="message error">Passwords do not match</div>
      )}

      <button
        type="submit"
        disabled={!passwordsMatch || !password || !confirmPassword}
        className={`submit-btn ${!passwordsMatch || !password || !confirmPassword ? 'disabled' : 'enabled'}`}
      >
        Register
      </button>
    </form>
  );
};

export default Form;
