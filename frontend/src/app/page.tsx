'use client';

import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

import './style.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <h1 className="home__title">Welcome</h1>

      {!user && (
        <p className="home__subtitle">
          You can explore clinics, doctors, and services as a guest.
        </p>
      )}

      <Link href="/clinics" className="home__button">
        View Clinics
      </Link>
      <Link href="/doctors" className="home__button">
        View Doctors
      </Link>
      <Link href="/services" className="home__button">
        View Services
      </Link>
    </div>
  );
}
