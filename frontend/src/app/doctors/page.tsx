'use server';

import Table from '@/components/doctors/Table';
import { FRONTEND_URL } from '@/config/frontend';

export default async function DoctorsPage() {
  try {
    const res = await fetch(`${FRONTEND_URL}/api/doctors`, {
      cache: 'no-store',
    });

    if (!res.ok) return <Table doctors={[]} />;

    const { doctors } = await res.json();

    return <Table doctors={doctors} />;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return <Table doctors={[]} />;
  }
}
