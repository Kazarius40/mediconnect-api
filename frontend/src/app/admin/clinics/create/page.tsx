'use client';

import React from 'react';
import ClinicForm from '@/components/clinics/ClinicForm';
import { useClinic } from '@/hooks/useClinic';
import { EntityHeader } from '@/components/common/EntityHeader';

export default function ClinicCreate() {
  const { doctors, loading } = useClinic();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <EntityHeader
        title="Create Clinic"
        editPath=""
        backText="Back to Clinics"
        onDeleteClick={() => {}}
        isAdmin={false}
      />

      <ClinicForm allDoctors={doctors} />
    </div>
  );
}
