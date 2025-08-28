'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

import './style.css';

export default function Form() {
  const { setUser } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      setUser(data.user);
      router.push('/');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !email || !password;

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h1 className="title">Login</h1>

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

      <label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
        />
      </label>

      {error && <div className="message error">{error}</div>}

      <button
        type="submit"
        disabled={isDisabled}
        className={`submit-btn ${isDisabled ? 'disabled' : 'enabled'}`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
