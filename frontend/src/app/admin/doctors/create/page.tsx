'use server';

import './style.css';
import { redirect } from 'next/navigation';
import { EntityHeader } from '@/components/common/EntityHeader';
import DoctorForm from '@/components/doctors/DoctorForm';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';
import { FRONTEND_URL } from '@/config/frontend';
import { ClinicShort } from '@/interfaces/clinic';
import { ServiceShort } from '@/interfaces/service';

export default async function DoctorCreate() {
  const { user } = await ssrFetchUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  try {
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
        return <p className="error-message">Failed to load {name}</p>;
      }
    }

    const { clinics }: { clinics: ClinicShort[] } = await clinicsRes.json();
    const { services }: { services: ServiceShort[] } = await servicesRes.json();

    return (
      <div className="page-container">
        <EntityHeader
          title="Create Doctor"
          editPath=""
          backText="Back to Doctors"
          showControls={false}
        />

        <DoctorForm allClinics={clinics} allServices={services} />
      </div>
    );
  } catch (error) {
    return <p className="error-message">Failed to load doctor</p>;
  }
}
