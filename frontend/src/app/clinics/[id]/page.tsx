'use server';

import { redirect } from 'next/navigation';
import Details from '@/components/clinic/Details';
import { FRONTEND_URL } from '@/config/frontend';

export default async function ClinicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const clinicId = Number((await params).id);

  if (!clinicId) redirect('/clinics');

  try {
    const res = await fetch(`${FRONTEND_URL}/api/clinics/${clinicId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      redirect('/clinics');
    }

    const { clinic } = await res.json();

    return <Details clinic={clinic} />;
  } catch (error) {
    console.error('Error fetching clinic:', error);
    redirect('/clinics');
  }
}
