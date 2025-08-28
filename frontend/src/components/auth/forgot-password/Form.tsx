'use client';

import { FormEvent, useState } from 'react';
import { AxiosError } from 'axios';
import { forgotPassword } from '@/api/client/auth';

import './style.css';

export default function Form() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await forgotPassword({ email });
      setMessage(res.data.message || 'Check your email for reset instructions');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  const isDisabled = !email || loading;

  return (
    <form onSubmit={handleSubmit} className="forgot-form">
      <h1 className="title">Forgot Password</h1>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />
      </label>

      <button
        type="submit"
        disabled={isDisabled}
        className={`submit-btn ${isDisabled ? 'disabled' : 'enabled'}`}
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  );
}
