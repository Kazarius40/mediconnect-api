'use client';

import './style.css';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import LogoutButton from '@/components/auth/Logout';
import React from 'react';

export default function Navbar() {
  const { user } = useAuth();

  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav className="navbar">
      <Link href="/">Home</Link>

      {user ? (
        <>
          <Link href="/profile">Profile</Link>

          {isAdmin && <Link href="/admin/users">Users</Link>}

          <LogoutButton />
        </>
      ) : (
        <>
          <Link href="/auth/login">Login</Link>
          <Link href="/auth/register">Register</Link>
          <Link href="/auth/forgot-password">Forgot Password</Link>
        </>
      )}
    </nav>
  );
}
