'use server';

import { redirect } from 'next/navigation';
import DoctorForm from '@/components/doctors/DoctorForm';
import { EntityHeader } from '@/components/common/EntityHeader';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';
import { ClinicShort } from '@/interfaces/clinic';
import { ServiceShort } from '@/interfaces/service';
import { Doctor } from '@/interfaces/doctor';
import { FRONTEND_URL } from '@/config/frontend';

export default async function DoctorEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const doctorId = Number((await params).id);

  if (!doctorId) redirect('/doctors');

  const { user } = await ssrFetchUser();
  if (!user || user.role !== 'ADMIN') redirect('/');

  try {
    const [doctorRes, clinicsRes, servicesRes] = await Promise.all([
      fetch(`${FRONTEND_URL}/api/doctors/${doctorId}`, { cache: 'no-store' }),
      fetch(`${FRONTEND_URL}/api/clinics`, { cache: 'no-store' }),
      fetch(`${FRONTEND_URL}/api/services`, { cache: 'no-store' }),
    ]);

    for (const [res, name] of [
      [doctorRes, 'doctor'],
      [clinicsRes, 'clinics'],
      [servicesRes, 'services'],
    ] as const) {
      if (!res.ok) {
        console.error(`Failed to fetch ${name}`, await res.text());
        return (
          <p className="text-red-600 text-center mt-4">Failed to load {name}</p>
        );
      }
    }

    const { doctor }: { doctor: Doctor } = await doctorRes.json();
    const { clinics }: { clinics: ClinicShort[] } = await clinicsRes.json();
    const { services }: { services: ServiceShort[] } = await servicesRes.json();

    return (
      <div className="max-w-3xl mx-auto p-4">
        <EntityHeader
          title="Edit Doctor"
          editPath=""
          backText="Back to Doctors"
          showControls={false}
        />

        <DoctorForm
          doctor={doctor}
          allClinics={clinics}
          allServices={services}
        />
      </div>
    );
  } catch (error) {
    return (
      <p className="text-red-600 text-center mt-4">
        Doctor not found or failed to load data
      </p>
    );
  }
}
