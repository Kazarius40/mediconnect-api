'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

import './style.css';

export default function LogoutButton() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.push('/auth/login');
    } catch (err) {
      console.error('LogoutButton failed:', err);
      setError('LogoutButton failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="logout-container">
      <button onClick={handleLogout} disabled={loading} className="logout-btn">
        {loading ? 'Logging out...' : 'LogoutButton'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
