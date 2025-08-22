'use server';

import Table from '@/components/clinics/Table';
import { FRONTEND_URL } from '@/config/frontend';

export default async function ClinicsPage() {
  try {
    const res = await fetch(`${FRONTEND_URL}/api/clinics`, {
      cache: 'no-store',
    });

    if (!res.ok) return <Table clinics={[]} />;

    const { clinics } = await res.json();

    return <Table clinics={clinics} />;
  } catch (error) {
    console.error('Error fetching clinics:', error);
    return <Table clinics={[]} />;
  }
}
