'use server';

import DoctorsPageClient from '@/components/doctors/DoctorsPageClient';
import { FRONTEND_URL } from '@/config/frontend';

export default async function DoctorsPage() {
  try {
    const res = await fetch(`${FRONTEND_URL}/api/doctors`, {
      cache: 'no-store',
    });

    if (!res.ok) return <DoctorsPageClient doctors={[]} />;

    const { doctors } = await res.json();

    return <DoctorsPageClient doctors={doctors} />;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return <DoctorsPageClient doctors={[]} />;
  }
}
