'use client';

import React from 'react';
import Link from 'next/link';
import LogoutButton from '@/components/auth/Logout';
import { useUser } from '@/hooks/useUser';

export default function Navbar() {
  const { user, loading } = useUser(false);

  const linkClass =
    'border border-gray-300 rounded px-3 py-1 cursor-pointer hover:bg-gray-100 transition';

  if (loading) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm px-4 py-2 flex space-x-4">
      <Link href="/" className={linkClass}>
        Home
      </Link>

      {user ? (
        <>
          <Link href="/profile" className={linkClass}>
            Profile
          </Link>

          {user.role === 'ADMIN' && (
            <Link href="/admin/users" className={linkClass}>
              Users
            </Link>
          )}

          <LogoutButton />
        </>
      ) : (
        <>
          <Link href="/auth/login" className={linkClass}>
            Login
          </Link>
          <Link href="/register" className={linkClass}>
            Register
          </Link>
          <Link href="/auth/forgot-password" className={linkClass}>
            Forgot Password
          </Link>
        </>
      )}
    </nav>
  );
}
