'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import doctorApi from '@/services/doctorApi';
import { Doctor } from '@/interfaces/doctor';
import { sortByName } from '@/utils/common/sort.util';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useEntityView } from '@/hooks/useEntityView';
import { useEntityDelete } from '@/hooks/useEntityDelete';
import { EntityHeader } from '@/components/common/EntityHeader';
import { EntityDates } from '@/components/common/EntityDates';
import { useUser } from '@/hooks/useUser';

export default function DoctorView() {
  const { id } = useParams();
  const { user, loading: userLoading } = useUser(false);

  const {
    entity: doctor,
    loading,
    error,
  } = useEntityView<Doctor>(doctorApi.getById, id);

  const { isConfirmOpen, setIsConfirmOpen, handleDelete } = useEntityDelete(
    doctorApi.delete,
    '/doctors',
  );

  if (loading || userLoading) return <p>Loading doctor...</p>;
  if (error || !doctor)
    return <p className="text-red-600">{error || 'Doctor not found'}</p>;

  const sortedClinics = doctor.clinics ? sortByName(doctor.clinics) : [];
  const sortedServices = doctor.services ? sortByName(doctor.services) : [];

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {/* Header */}
      <EntityHeader
        title={`${doctor.lastName} ${doctor.firstName}`}
        editPath={`/admin/doctors/${doctor.id}`}
        backText="Back to Doctors"
        onDeleteClick={() => setIsConfirmOpen(true)}
        isAdmin={isAdmin}
      />

      {/* Basic info */}
      <div className="space-y-2 mb-6">
        {doctor.phone && (
          <p>
            <strong>Phone:</strong> {doctor.phone}
          </p>
        )}
        {doctor.email && (
          <p>
            <strong>Email:</strong> {doctor.email}
          </p>
        )}
        <EntityDates
          createdAt={doctor.createdAt}
          updatedAt={doctor.updatedAt}
        />
      </div>

      {/* === Services Section === */}
      <div className="mt-6 border rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Services</h2>
        {sortedServices.length ? (
          <ul className="list-disc ml-5 space-y-2">
            {sortedServices.map((s) => (
              <li key={s.id}>
                <span className="font-medium">{s.name}</span>
                {s.description && (
                  <p className="text-sm text-gray-600">{s.description}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No services linked</p>
        )}
      </div>

      {/* === Clinics Section === */}
      <div className="mt-6 border rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Clinics</h2>
        {sortedClinics.length ? (
          <ul className="list-disc ml-5 space-y-3">
            {sortedClinics.map((c) => (
              <li key={c.id}>
                <span className="font-medium">{c.name}</span>
                <div className="text-sm text-gray-700">
                  <p>{c.address}</p>
                  <p>
                    <strong>Phone:</strong> {c.phone}
                  </p>
                  {c.email && (
                    <p>
                      <strong>Email:</strong> {c.email}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No clinics linked</p>
        )}
      </div>

      {/* Confirm deletion */}
      {isConfirmOpen && doctor && (
        <ConfirmModal
          title="Confirm deletion"
          message={`Are you sure you want to delete doctor "${doctor.lastName} ${doctor.firstName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => handleDelete(doctor.id)}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </div>
  );
}
