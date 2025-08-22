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

  return (
    <form onSubmit={handleSubmit} className="forgot-form">
      <h2 className="forgot-title">Forgot Password</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading} className="forgot-button">
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  );
}
