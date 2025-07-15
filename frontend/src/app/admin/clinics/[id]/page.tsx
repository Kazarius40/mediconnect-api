'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ClinicForm from '@/components/clinics/ClinicForm';
import { useClinic } from '@/hooks/useClinic';

export default function ClinicEdit() {
  const { id } = useParams();
  const { clinic, doctors, loading, error } = useClinic(Number(id));

  if (loading) return <p>Loading...</p>;
  if (error || !clinic)
    return <p className="text-red-600">{error || 'Clinic not found'}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Clinic</h1>
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
