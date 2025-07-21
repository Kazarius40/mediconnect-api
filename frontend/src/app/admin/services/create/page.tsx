'use client';

import React from 'react';
import { EntityHeader } from '@/components/common/EntityHeader';
import { useServiceHook } from '@/hooks/domain/useService.hook';
import ServiceForm from '@/components/services/ServiceForm';

export default function ServiceCreate() {
  const { doctors, loading } = useServiceHook();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <EntityHeader
        title="Create Service"
        editPath=""
        backText="Back to Services"
        onDeleteClick={() => {}}
        isAdmin={false}
      />

      <ServiceForm allDoctors={doctors} />
    </div>
  );
}
