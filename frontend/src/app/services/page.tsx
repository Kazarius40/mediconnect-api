'use server';

import { FRONTEND_URL } from '@/config/frontend';
import Table from '@/components/services/Table';

export default async function ServicesPage() {
  try {
    const res = await fetch(`${FRONTEND_URL}/api/services`, {
      cache: 'no-store',
    });

    if (!res.ok) return <Table services={[]} />;

    const { services } = await res.json();

    return <Table services={services} />;
  } catch (error) {
    console.error('Error fetching services:', error);
    return <Table services={[]} />;
  }
}
