'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ClinicForm from '@/components/clinics/ClinicForm';
import { Clinic } from '@/interfaces/clinic';
import { Doctor } from '@/interfaces/doctor';
import clinicService from '@/services/clinic.service';
import doctorService from '@/services/doctor.service';

export default function EditClinicPage() {
  const { id } = useParams();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [clinicData, doctorsData] = await Promise.all([
          clinicService.getById(Number(id)),
          doctorService.getAll(),
        ]);
        setClinic(clinicData);
        setDoctors(doctorsData);
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [id]);

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
