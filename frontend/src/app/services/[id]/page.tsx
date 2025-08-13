'use server';

import { redirect } from 'next/navigation';
import { FRONTEND_URL } from '@/config/frontend';
import ServiceViewClient from '@/components/services/ServiceViewClient';

export default async function ServiceViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const serviceId = Number((await params).id);

  if (!serviceId) redirect(`/services`);

  try {
    const res = await fetch(`${FRONTEND_URL}/api/services/${serviceId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      redirect('/services');
    }

    const { service } = await res.json();

    return <ServiceViewClient service={service} />;
  } catch (error) {
    console.error('Error fetching service:', error);
    redirect('/services');
  }
}
