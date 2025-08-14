'use client';

import React, { useState } from 'react';
import { Service } from '@/interfaces/service';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useEntityDeleteHook } from '@/hooks/core/useEntityDelete.hook';
import { EntityHeader } from '@/components/common/EntityHeader';
import { EntityDates } from '@/components/common/EntityDates';
import { DoctorList } from '@/components/doctors/DoctorList';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useSortedSearch } from '@/hooks/useSortedSearch';
import { sortByFields } from '@/utils/common/sort.util';

export default function ServiceViewClient({
  service: initialService,
}: {
  service: Service;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [service] = useState<Service>(initialService);

  const doctors = service.doctors ?? [];

  const { isConfirmOpen, setIsConfirmOpen, handleDelete } = useEntityDeleteHook(
    async (id) => {
      await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });

      router.push('/services');
    },
    '/services',
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
        title={service.name}
        editPath={`/admin/services/${service.id}`}
        backText="Back to Services"
        onDeleteClick={() => setIsConfirmOpen(true)}
        isAdmin={isAdmin}
      />

      {/* === Basic info === */}
      <div className="space-y-2 mb-6">
        <p>
          <strong>Description:</strong>{' '}
          {service.description || 'No description available'}
        </p>
        <EntityDates
          createdAt={service.createdAt}
          updatedAt={service.updatedAt}
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
          <DoctorList
            doctors={filteredDoctors}
            search={search}
            mode="withClinics"
          />
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
          message={`Are you sure you want to delete service "${service.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => handleDelete(service.id)}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </div>
  );
}
