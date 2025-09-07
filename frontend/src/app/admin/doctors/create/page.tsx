'use server';

import { EntityHeader } from '@/components/common/entity-header';
import Form from '@/components/doctor/Form';
import { FRONTEND_URL } from '@/config/frontend';
import { ClinicShort } from '@/interfaces/clinic';
import { ServiceShort } from '@/interfaces/service';

export default async function DoctorCreate() {
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
      <>
        <EntityHeader
          title="Create Doctor"
          editPath=""
          backText="Back to Doctors"
          showControls={false}
        />

        <Form allClinics={clinics} allServices={services} />
      </>
    );
  } catch (error) {
    return <p className="error-message">Failed to load doctor</p>;
  }
}
