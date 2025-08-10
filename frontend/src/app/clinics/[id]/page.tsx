'use server';

import { redirect } from 'next/navigation';
import ClinicViewClient from '@/components/clinics/ClinicViewClient';
import { FRONTEND_URL } from '@/config/frontend';

export default async function ClinicViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const clinicId = Number(resolvedParams.id);

  if (!clinicId) redirect('/clinics');

  try {
    const res = await fetch(`${FRONTEND_URL}/api/clinics/${clinicId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      redirect('/clinics');
    }

    const { clinic } = await res.json();

    return <ClinicViewClient clinic={clinic} />;
  } catch (error) {
    console.error('Error fetching clinic:', error);
    redirect('/clinics');
  }
}
