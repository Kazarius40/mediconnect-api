'use server';

import DoctorForm from '@/components/doctors/DoctorForm';
import { EntityHeader } from '@/components/common/EntityHeader';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';
import { redirect } from 'next/navigation';
import { FRONTEND_URL } from '@/config/frontend';
import { ClinicShort } from '@/interfaces/clinic';
import { ServiceShort } from '@/interfaces/service';

export default async function DoctorCreate() {
  const authResult = await ssrFetchUser();
  const user = authResult.user;

  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  const [clinicsRes, servicesRes] = await Promise.all([
    fetch(`${FRONTEND_URL}/api/clinics`, { cache: 'no-store' }),
    fetch(`${FRONTEND_URL}/api/services`, { cache: 'no-store' }),
  ]);

  for (const [res, name] of [
    [clinicsRes, 'clinics'],
    [servicesRes, 'services'],
  ] as const) {
    if (!res.ok) {
      console.error(`Failed to fetch ${name}`, await res.text());
      redirect('/doctors');
    }
  }

  const { clinics }: { clinics: ClinicShort[] } = await clinicsRes.json();
  const { services }: { services: ServiceShort[] } = await servicesRes.json();

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <EntityHeader
        title="Create Doctor"
        editPath=""
        backText="Back to Doctors"
        showControls={false}
      />

      <DoctorForm allClinics={clinics} allServices={services} />
    </div>
  );
}
