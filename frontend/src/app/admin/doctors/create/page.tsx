'use client';

import React from 'react';
import DoctorForm from '@/components/doctors/DoctorForm';
import { useDoctorHook } from '@/hooks/domain/useDoctor.hook';
import { EntityHeader } from '@/components/common/EntityHeader';

export default function DoctorCreate() {
  const { clinics, services, loading } = useDoctorHook();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <EntityHeader
        title="Create Doctor"
        editPath=""
        backText="Back to Doctors"
        onDeleteClick={() => {}}
        isAdmin={false}
      />

      <DoctorForm allClinics={clinics} allServices={services} />
    </div>
  );
}
