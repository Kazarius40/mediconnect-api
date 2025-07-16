'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ClinicForm from '@/components/clinics/ClinicForm';
import { useClinic } from '@/hooks/useClinic';
import { EntityHeader } from '@/components/common/EntityHeader';

export default function ClinicEdit() {
  const { id } = useParams();
  const { clinic, doctors, loading, error } = useClinic(Number(id));

  if (loading) return <p>Loading...</p>;
  if (error || !clinic)
    return <p className="text-red-600">{error || 'Clinic not found'}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <EntityHeader
        title="Edit Clinic"
        editPath=""
        backText="Back to Clinics"
        onDeleteClick={() => {}}
        isAdmin={false}
      />

      <ClinicForm
        clinicId={clinic.id}
        allDoctors={doctors}
        initialValues={{
          name: clinic.name,
          address: clinic.address,
          phone: clinic.phone,
          email: clinic.email,
          doctorIds: clinic.doctors?.map((d) => d.id) || [],
        }}
      />
    </div>
  );
}
