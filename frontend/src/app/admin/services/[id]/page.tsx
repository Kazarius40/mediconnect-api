import React from 'react';
import { EntityHeader } from '@/components/common/EntityHeader';
import ServiceForm from '@/components/services/ServiceForm';
import { getDoctorsFromServer, getServiceFromServer } from '@/lib/api';
import { redirect } from 'next/navigation';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';

export default async function ServiceEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const serviceId = Number(resolvedParams.id);

  if (!serviceId) redirect('/services');

  const authResult = await ssrFetchUser();
  const user = authResult.user;
  const token = authResult.accessToken;

  if (!user || user.role !== 'ADMIN' || !token) {
    redirect('/');
  }

  try {
    const [service, doctors] = await Promise.all([
      getServiceFromServer(token, serviceId),
      getDoctorsFromServer(token),
    ]);

    if (!service) {
      return <p className="text-red-600 text-center mt-4">Service not found</p>;
    }

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
