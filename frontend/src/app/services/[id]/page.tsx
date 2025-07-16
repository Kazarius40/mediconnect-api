'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import serviceApi from '@/services/serviceApi';
import { Service } from '@/interfaces/service';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useEntityView } from '@/hooks/useEntityView';
import { useEntityDelete } from '@/hooks/useEntityDelete';
import { EntityHeader } from '@/components/common/EntityHeader';
import { EntityDates } from '@/components/common/EntityDates';
import { useUser } from '@/hooks/useUser';
import { DoctorList } from '@/components/doctors/DoctorList';

export default function ServiceView() {
  const { id } = useParams();
  const { user, loading: userLoading } = useUser(false);

  const {
    entity: service,
    loading,
    error,
  } = useEntityView<Service>(serviceApi.getById, id);

  const { isConfirmOpen, setIsConfirmOpen, handleDelete } = useEntityDelete(
    serviceApi.delete,
    '/services',
  );
  const [search, setSearch] = useState('');

  if (loading || userLoading) return <p>Loading service...</p>;
  if (error || !service)
    return <p className="text-red-600">{error || 'Service not found'}</p>;

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {/* Header */}
      <EntityHeader
        title={service.name}
        editPath={`/admin/services/${service.id}`}
        backText="Back to Services"
        onDeleteClick={() => setIsConfirmOpen(true)}
        isAdmin={isAdmin}
      />

      {/* Basic info */}
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
      {service.doctors && service.doctors.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Doctors</h2>
          <input
            type="text"
            placeholder="Search doctors by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded shadow-sm"
          />
          <DoctorList
            doctors={service.doctors}
            search={search}
            mode="withClinics"
          />
        </div>
      )}

      {/* Confirm deletion */}
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
