'use client';

import React from 'react';
import { Doctor } from '@/interfaces/doctor';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useEntityDeleteHook } from '@/hooks/core/useEntityDelete.hook';
import { EntityHeader } from '@/components/common/EntityHeader';
import { EntityDates } from '@/components/common/EntityDates';
import doctorApi from '@/services/doctorApi';
import { useAuth } from '@/providers/AuthProvider';
import { useSortedSearch } from '@/hooks/useSortedSearch';
import { useRouter } from 'next/navigation';
import { useDoctor } from '@/hooks/api/useDoctor';
import { sortByFields } from '@/utils/common/sort.util';

export default function DoctorViewClient({
  doctor: initialDoctor,
}: {
  doctor: Doctor;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const { data: doctor } = useDoctor(initialDoctor.id, initialDoctor);

  const services = doctor.services ?? [];
  const clinics = doctor.clinics ?? [];

  const { isConfirmOpen, setIsConfirmOpen, handleDelete } = useEntityDeleteHook(
    async (id) => {
      await doctorApi.delete(id);

      router.push('/doctors');
    },
    '/doctors',
  );

  const {
    search: serviceSearch,
    setSearch: setServiceSearch,
    filteredItems: filteredServices,
  } = useSortedSearch(
    services,
    (items) => sortByFields(items, ['name', 'description']),
    ['name', 'description'],
  );

  const {
    search: clinicSearch,
    setSearch: setClinicSearch,
    filteredItems: filteredClinics,
  } = useSortedSearch(
    clinics,
    (items) => sortByFields(items, ['name', 'address', 'phone', 'email']),
    ['name', 'address', 'phone', 'email'],
  );

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

        {services.length > 0 && (
          <input
            type="text"
            placeholder="Search services by name or description..."
            value={serviceSearch}
            onChange={(e) => setServiceSearch(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded shadow-sm"
          />
        )}

        {filteredServices.length > 0 ? (
          <ul className="list-disc ml-5 space-y-2">
            {filteredServices.map((s) => (
              <li key={s.id}>
                <span className="font-medium">{s.name}</span>
                {s.description && (
                  <p className="text-sm text-gray-600">{s.description}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            {services.length === 0
              ? 'No services linked'
              : 'No matching services'}
          </p>
        )}
      </div>

      {/* === Clinics Section === */}
      <div className="mt-6 border rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Clinics</h2>

        {clinics.length > 0 && (
          <input
            type="text"
            placeholder="Search clinics by name, address, phone or email..."
            value={clinicSearch}
            onChange={(e) => setClinicSearch(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded shadow-sm"
          />
        )}

        {filteredClinics.length > 0 ? (
          <ul className="list-disc ml-5 space-y-3">
            {filteredClinics.map((c) => (
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
          <p className="text-gray-500">
            {clinics.length === 0 ? 'No clinics linked' : 'No matching clinics'}
          </p>
        )}
      </div>

      {/* Confirm deletion */}
      {isConfirmOpen && (
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
