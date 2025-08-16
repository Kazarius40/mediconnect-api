'use server';

import ClinicsComponent from '@/components/clinics/ClinicsComponent';
import { FRONTEND_URL } from '@/config/frontend';

export default async function ClinicsPage() {
  try {
    const res = await fetch(`${FRONTEND_URL}/api/clinics`, {
      cache: 'no-store',
    });

    if (!res.ok) return <ClinicsComponent clinics={[]} />;

    const { clinics } = await res.json();

    return <ClinicsComponent clinics={clinics} />;
  } catch (error) {
    console.error('Error fetching clinics:', error);
    return <ClinicsComponent clinics={[]} />;
  }
}
