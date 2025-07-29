'use client';

import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

export default function Home() {
  const { user, loading } = useAuth();

  const buttonClass =
    'block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded mb-4 transition';

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-12 space-y-4">
        <SkeletonButton />
        <SkeletonButton />
        <SkeletonButton />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome</h1>

      {!user && (
        <p className="text-center text-gray-600 mb-6">
          You can explore clinics, doctors, and services as a guest.
        </p>
      )}

      <Link href="/clinics" className={buttonClass}>
        View Clinics
      </Link>
      <Link href="/doctors" className={buttonClass}>
        View Doctors
      </Link>
      <Link href="/services" className={buttonClass}>
        View Services
      </Link>
    </div>
  );
}

function SkeletonButton() {
  return <div className="w-full h-12 bg-gray-200 rounded animate-pulse" />;
}
