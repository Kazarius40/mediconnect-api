'use server';

import React from 'react';
import { EntityHeader } from '@/components/common/EntityHeader';
import ServiceForm from '@/components/services/ServiceForm';
import { redirect } from 'next/navigation';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';
import { FRONTEND_URL } from '@/config/frontend';
import { Doctor } from '@/interfaces/doctor';
import { Service } from '@/interfaces/service';

type DoctorShort = Pick<Doctor, 'id' | 'firstName' | 'lastName'>;
type ServiceFull = Omit<Service, 'doctors'> & { doctors: DoctorShort[] };

export default async function ServiceEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const serviceId = Number((await params).id);

  if (!serviceId) redirect('/services');

  const { user } = await ssrFetchUser();
  if (!user || user.role !== 'ADMIN') redirect('/');

  try {
    const [serviceRes, doctorsRes] = await Promise.all([
      fetch(`${FRONTEND_URL}/api/services/${serviceId}`, { cache: 'no-store' }),
      fetch(`${FRONTEND_URL}/api/doctors`, { cache: 'no-store' }),
    ]);

    if (!serviceRes.ok || !doctorsRes.ok) {
      return (
        <p className="text-red-600 text-center mt-4">Failed to load data</p>
      );
    }

    const { service }: { service: ServiceFull } = await serviceRes.json();
    const { doctors }: { doctors: DoctorShort[] } = await doctorsRes.json();

    return (
      <div className="max-w-3xl mx-auto p-4">
        <EntityHeader
          title="Edit Service"
          editPath=""
          backText="Back to Services"
          isAdmin={false}
        />

        <ServiceForm
          serviceId={service.id}
          allDoctors={doctors}
          initialValues={{
            name: service.name,
            description: service.description || '',
            doctorIds: service.doctors?.map((d: any) => d.id) || [],
          }}
        />
      </div>
    );
  } catch (error) {
    return (
      <p className="text-red-600 text-center mt-4">Failed to load service</p>
    );
  }
}
