'use client';

import Link from 'next/link';

export default function Home() {
  const buttonClass =
    'block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded mb-4 transition';

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome</h1>

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
