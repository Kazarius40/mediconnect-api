'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import DoctorForm from '@/components/doctors/DoctorForm';
import { useDoctorHook } from '@/hooks/domain/useDoctor.hook';
import { EntityHeader } from '@/components/common/EntityHeader';

export default function DoctorEdit() {
  const { id } = useParams();
  const { doctor, clinics, services, loading, error } = useDoctorHook(
    Number(id),
  );

  if (loading) return <p>Loading...</p>;
  if (error || !doctor)
    return <p className="text-red-600">{error || 'Doctor not found'}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <EntityHeader
        title="Edit Doctor"
        editPath=""
        backText="Back to Doctors"
        onDeleteClick={() => {}}
        isAdmin={false}
      />

      <DoctorForm
        doctorId={doctor.id}
        allClinics={clinics}
        allServices={services}
        initialValues={{
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          phone: doctor.phone,
          email: doctor.email,
          clinicIds: doctor.clinics?.map((c) => c.id) || [],
          serviceIds: doctor.services?.map((s) => s.id) || [],
        }}
      />
    </div>
  );
}
