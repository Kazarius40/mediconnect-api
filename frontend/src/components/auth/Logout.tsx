'use client';

import React, { useState } from 'react';
import { setCookie } from '@/utils/cookies/cookies';
import { logout } from '@/api/auth';

const LogoutButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      await logout();
      setCookie('accessToken', '', { maxAge: 0 });

      window.location.href = '/auth/login';
    } catch (err) {
      setError('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-1 rounded cursor-pointer hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Logging out...' : 'Logout'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default LogoutButton;
