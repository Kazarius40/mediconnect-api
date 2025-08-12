'use server';

import ServicesPageClient from '@/components/services/ServicesPageClient';
import { FRONTEND_URL } from '@/config/frontend';

export default async function ServicesPage() {
  try {
    const res = await fetch(`${FRONTEND_URL}/api/services`, {
      cache: 'no-store',
    });

    if (!res.ok) return <ServicesPageClient services={[]} />;

    const { services } = await res.json();

    return <ServicesPageClient services={services} />;
  } catch (error) {
    console.error('Error fetching services:', error);
    return <ServicesPageClient services={[]} />;
  }
}
