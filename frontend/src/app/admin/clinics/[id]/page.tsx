'use server';

import './style.css';
import { redirect } from 'next/navigation';
import { EntityHeader } from '@/components/common/EntityHeader';
import ClinicForm from '@/components/clinics/ClinicForm';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';
import { FRONTEND_URL } from '@/config/frontend';
import { Clinic } from '@/interfaces/clinic';
import { DoctorShort } from '@/interfaces/doctor';

export default async function ClinicEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const clinicId = Number((await params).id);
  if (!clinicId) redirect('/clinics');

  const { user } = await ssrFetchUser();
  if (!user || user.role !== 'ADMIN') redirect('/');

  try {
    const [clinicRes, doctorsRes] = await Promise.all([
      fetch(`${FRONTEND_URL}/api/clinics/${clinicId}`, { cache: 'no-store' }),
      fetch(`${FRONTEND_URL}/api/doctors`, { cache: 'no-store' }),
    ]);

    for (const [res, name] of [
      [clinicRes, 'clinic'],
      [doctorsRes, 'doctors'],
    ] as const) {
      if (!res.ok) {
        console.error(`Failed to fetch ${name}`, await res.text());
        return <p className="error-message">Failed to load {name}</p>;
      }
    }

    const { clinic }: { clinic: Clinic } = await clinicRes.json();
    const { doctors }: { doctors: DoctorShort[] } = await doctorsRes.json();

    return (
      <div className="page-container">
        <EntityHeader
          title="Edit Clinic"
          editPath=""
          backText="Back to Clinics"
          showControls={false}
        />

        <ClinicForm clinic={clinic} allDoctors={doctors} />
      </div>
    );
  } catch (error) {
    return <p className="error-message">Failed to load clinic</p>;
  }
}
