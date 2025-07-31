'use client';

import React from 'react';
import { Clinic } from '@/interfaces/clinic';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { DoctorList } from '@/components/doctors/DoctorList';
import { useEntityDeleteHook } from '@/hooks/core/useEntityDelete.hook';
import { EntityHeader } from '@/components/common/EntityHeader';
import { EntityDates } from '@/components/common/EntityDates';
import clinicApi from '@/services/clinicApi';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useClinic } from '@/hooks/api/useClinic';
import { useSortedSearch } from '@/hooks/useSortedSearch';
import { sortByFields } from '@/utils/common/sort.util';

export default function ClinicViewClient({
  clinic: initialClinic,
}: {
  clinic: Clinic;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const { data: clinic } = useClinic(initialClinic.id, initialClinic);

  const doctors = clinic.doctors ?? [];

  const { isConfirmOpen, setIsConfirmOpen, handleDelete } = useEntityDeleteHook(
    async (id) => {
      await clinicApi.delete(id);

      router.push('/clinics');
    },
    '/clinics',
  );

  const {
    search,
    setSearch,
    filteredItems: filteredDoctors,
  } = useSortedSearch(
    doctors,
    (items) => sortByFields(items, ['lastName', 'firstName']),
    ['firstName', 'lastName', 'email', 'phone'],
  );

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {/* === Header === */}
      <EntityHeader
        title={clinic.name}
        editPath={`/admin/clinics/${clinic.id}`}
        backText="Back to Clinics"
        onDeleteClick={() => setIsConfirmOpen(true)}
        isAdmin={isAdmin}
      />

      {/* === Basic info === */}
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
      <div className="mt-6 border rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Doctors</h2>

        {doctors.length > 0 && (
          <input
            type="text"
            placeholder="Search doctors by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded shadow-sm"
          />
        )}

        {filteredDoctors.length > 0 ? (
          <DoctorList doctors={filteredDoctors} search={search} />
        ) : (
          <p className="text-gray-500">
            {doctors.length === 0 ? 'No doctors linked' : 'No matching doctors'}
          </p>
        )}
      </div>

      {/* === Confirm deletion === */}
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
