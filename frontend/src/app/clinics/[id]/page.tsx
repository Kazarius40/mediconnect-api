import { redirect } from 'next/navigation';
import { Clinic } from '@/interfaces/clinic';
import ClinicViewClient from '@/components/clinics/ClinicViewClient';
import { getClinicById } from '@/lib/api/clinics';

export default async function ClinicViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const clinicId = Number(resolvedParams.id);

  if (!clinicId) redirect('/clinics');

  let clinic: Clinic | null = null;

  try {
    clinic = await getClinicById(clinicId);
  } catch (e) {
    console.error('Failed to fetch clinic', e);
    redirect('/clinics');
  }

  return <ClinicViewClient clinic={clinic} />;
}
