'use client';

import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import LogoutButton from '@/components/auth/Logout';
import React from 'react';

export default function Navbar() {
  const { user, loading } = useAuth();

  const linkClass =
    'border border-gray-300 rounded px-3 py-1 cursor-pointer hover:bg-gray-100 transition';

  const isAdmin = user?.role === 'ADMIN';

  if (loading) {
    return <NavbarSkeleton />;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white text-black border-b shadow-sm px-4 py-2 flex space-x-4">
      <Link href="/" className={linkClass}>
        Home
      </Link>

      {user ? (
        <>
          <Link href="/profile" className={linkClass}>
            Profile
          </Link>

          {isAdmin && (
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

function SkeletonLink() {
  return (
    <div className="h-8 w-24 bg-gray-200 rounded border border-gray-300 animate-pulse" />
  );
}

function NavbarSkeleton() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm px-4 py-2 flex space-x-4">
      <SkeletonLink />
      <SkeletonLink />
      <SkeletonLink />
      <SkeletonLink />
    </nav>
  );
}
