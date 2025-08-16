'use server';

import DoctorsComponent from '@/components/doctors/DoctorsComponent';
import { FRONTEND_URL } from '@/config/frontend';

export default async function DoctorsPage() {
  try {
    const res = await fetch(`${FRONTEND_URL}/api/doctors`, {
      cache: 'no-store',
    });

    if (!res.ok) return <DoctorsComponent doctors={[]} />;

    const { doctors } = await res.json();

    return <DoctorsComponent doctors={doctors} />;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return <DoctorsComponent doctors={[]} />;
  }
}
