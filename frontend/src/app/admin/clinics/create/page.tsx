'use client';

import React from 'react';
import ClinicForm from '@/components/clinics/ClinicForm';
import { useClinic } from '@/hooks/useClinic';

export default function ClinicCreate() {
  const { doctors, loading } = useClinic();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Create Clinic</h1>
      <ClinicForm allDoctors={doctors} />
    </div>
  );
}
