'use server';

import ClinicsClientPage from '@/components/clinics/ClinicsClientPage';
import { FRONTEND_URL } from '@/config/frontend';

export default async function ClinicsPage() {
  try {
    const res = await fetch(`${FRONTEND_URL}/api/clinics`, {
      cache: 'no-store',
    });

    if (!res.ok) return <ClinicsClientPage clinics={[]} />;

    const { clinics } = await res.json();

    return <ClinicsClientPage clinics={clinics} />;
  } catch (error) {
    console.error('Error fetching clinics:', error);
    return <ClinicsClientPage clinics={[]} />;
  }
}
