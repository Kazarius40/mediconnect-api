'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

import './style.css';

export default function LogoutButton() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.refresh();
    } catch (err) {
      console.error('LogoutButton failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLogout} disabled={loading} className="logout-btn">
      Logout
    </button>
  );
}
