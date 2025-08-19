'use server';

import { FRONTEND_URL } from '@/config/frontend';
import ServicesComponent from '@/components/services/ServicesComponent';

export default async function ServicesPage() {
  try {
    const res = await fetch(`${FRONTEND_URL}/api/services`, {
      cache: 'no-store',
    });

    if (!res.ok) return <ServicesComponent services={[]} />;

    const { services } = await res.json();

    return <ServicesComponent services={services} />;
  } catch (error) {
    console.error('Error fetching services:', error);
    return <ServicesComponent services={[]} />;
  }
}
