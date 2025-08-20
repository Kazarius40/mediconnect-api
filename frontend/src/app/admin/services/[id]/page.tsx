'use server';

import './style.css';
import { redirect } from 'next/navigation';
import { EntityHeader } from '@/components/common/EntityHeader';
import ServiceForm from '@/components/services/ServiceForm';
import { FRONTEND_URL } from '@/config/frontend';
import { Service } from '@/interfaces/service';
import { DoctorShort } from '@/interfaces/doctor';

export default async function ServiceEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const serviceId = Number((await params).id);
  if (!serviceId) redirect('/services');

  try {
    const [serviceRes, doctorsRes] = await Promise.all([
      fetch(`${FRONTEND_URL}/api/services/${serviceId}`, { cache: 'no-store' }),
      fetch(`${FRONTEND_URL}/api/doctors`, { cache: 'no-store' }),
    ]);

    for (const [res, name] of [
      [serviceRes, 'service'],
      [doctorsRes, 'doctors'],
    ] as const) {
      if (!res.ok) {
        console.error(`Failed to fetch ${name}`, await res.text());
        return <p className="error-message">Failed to load {name}</p>;
      }
    }

    const { service }: { service: Service } = await serviceRes.json();
    const { doctors }: { doctors: DoctorShort[] } = await doctorsRes.json();

    return (
      <div className="page-container">
        <EntityHeader
          title="Edit Service"
          editPath=""
          backText="Back to Services"
          showControls={false}
        />

        <ServiceForm service={service} allDoctors={doctors} />
      </div>
    );
  } catch (error) {
    return <p className="error-message">Failed to load service</p>;
  }
}
