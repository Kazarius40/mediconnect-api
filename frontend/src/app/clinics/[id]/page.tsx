'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import clinicApi from '@/services/clinicApi';
import { Clinic } from '@/interfaces/clinic';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { DoctorList } from '@/components/doctors/DoctorList';
import { useEntityViewHook } from '@/hooks/core/useEntityView.hook';
import { useEntityDeleteHook } from '@/hooks/core/useEntityDelete.hook';
import { EntityHeader } from '@/components/common/EntityHeader';
import { EntityDates } from '@/components/common/EntityDates';
import { authProvider } from '@/providers/AuthProvider';

export default function ClinicView() {
  const { id } = useParams();
  const { user, loading: userLoading } = authProvider();

  const {
    entity: clinic,
    loading,
    error,
  } = useEntityViewHook<Clinic>(clinicApi.getById, id);

  const { isConfirmOpen, setIsConfirmOpen, handleDelete } = useEntityDeleteHook(
    clinicApi.delete,
    '/clinics',
  );
  const [search, setSearch] = useState('');

  if (loading || userLoading) return <p>Loading clinic...</p>;
  if (error || !clinic)
    return <p className="text-red-600">{error || 'Clinic not found'}</p>;

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {/* Header */}
      <EntityHeader
        title={clinic.name}
        editPath={`/admin/clinics/${clinic.id}`}
        backText="Back to Clinics"
        onDeleteClick={() => setIsConfirmOpen(true)}
        isAdmin={isAdmin}
      />

      {/* Basic info */}
      <div className="space-y-2 mb-6">
        <p>
          <strong>Address:</strong> {clinic.address}
        </p>
        <p>
          <strong>Phone:</strong> {clinic.phone}
        </p>
        {clinic.email && (
          <p>
            <strong>Email:</strong> {clinic.email}
          </p>
        )}
        <EntityDates
          createdAt={clinic.createdAt}
          updatedAt={clinic.updatedAt}
        />
      </div>

      {/* === Doctors Section === */}
      {clinic.doctors && clinic.doctors?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Doctors</h2>
          <input
            type="text"
            placeholder="Search doctors by name, email, phone or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded shadow-sm"
          />
          <DoctorList doctors={clinic.doctors} search={search} />
        </div>
      )}

      {/* Confirm deletion */}
      {isConfirmOpen && (
        <ConfirmModal
          title="Confirm deletion"
          message={`Are you sure you want to delete clinic "${clinic.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => handleDelete(clinic.id)}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </div>
  );
}
