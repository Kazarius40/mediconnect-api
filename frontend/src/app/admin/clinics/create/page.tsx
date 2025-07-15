'use client';

import React, { useEffect, useState } from 'react';
import { Doctor } from '@/interfaces/doctor';
import doctorService from '@/services/doctor.service';
import ClinicForm from '@/components/clinics/ClinicForm';

export default function CreateClinicPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorService
      .getAll()
      .then((data) => setDoctors(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Create Clinic</h1>
      <ClinicForm allDoctors={doctors} />
    </div>
  );
}
