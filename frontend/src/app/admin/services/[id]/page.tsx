'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { EntityHeader } from '@/components/common/EntityHeader';
import { useServiceHook } from '@/hooks/domain/useService.hook';
import ServiceForm from '@/components/services/ServiceForm';

export default function ServiceEdit() {
  const { id } = useParams();
  const { service, doctors, loading, error } = useServiceHook(Number(id));

  if (loading) return <p>Loading...</p>;
  if (error || !service)
    return <p className="text-red-600">{error || 'Service not found'}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <EntityHeader
        title="Edit Service"
        editPath=""
        backText="Back to Services"
        onDeleteClick={() => {}}
        isAdmin={false}
      />

      <ServiceForm
        serviceId={service.id}
        allDoctors={doctors}
        initialValues={{
          name: service.name,
          description: service.description || '',
          doctorIds: service.doctors?.map((d) => d.id) || [],
        }}
      />
    </div>
  );
}
