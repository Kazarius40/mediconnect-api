'use server';

import './style.css';
import { redirect } from 'next/navigation';
import { EntityHeader } from '@/components/common/EntityHeader';
import Form from '@/components/doctor/Form';
import { FRONTEND_URL } from '@/config/frontend';
import { Doctor } from '@/interfaces/doctor';
import { ClinicShort } from '@/interfaces/clinic';
import { ServiceShort } from '@/interfaces/service';

export default async function DoctorEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const doctorId = Number((await params).id);
  if (!doctorId) redirect('/doctors');

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
        return <p className="error-message">Failed to load {name}</p>;
      }
    }

    const { doctor }: { doctor: Doctor } = await doctorRes.json();
    const { clinics }: { clinics: ClinicShort[] } = await clinicsRes.json();
    const { services }: { services: ServiceShort[] } = await servicesRes.json();

    return (
      <div className="page-container">
        <EntityHeader
          title="Edit Doctor"
          editPath=""
          backText="Back to Doctors"
          showControls={false}
        />

        <Form doctor={doctor} allClinics={clinics} allServices={services} />
      </div>
    );
  } catch (error) {
    return <p className="error-message">Failed to load doctor</p>;
  }
}
