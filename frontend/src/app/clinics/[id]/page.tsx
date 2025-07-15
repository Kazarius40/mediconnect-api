'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import clinicApi from '@/services/clinicApi';
import { Clinic } from '@/interfaces/clinic';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { DoctorList } from '@/components/doctors/DoctorList';

export default function ClinicView() {
  const { id } = useParams();
  const router = useRouter();

  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    clinicApi
      .getById(Number(id))
      .then((data) => setClinic(data))
      .catch(() => setError('Failed to load clinic details'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDeleteClinic = async () => {
    if (!clinic) return;
    setLoading(true);
    try {
      await clinicApi.delete(clinic.id);
      router.push('/clinics');
    } catch (err) {
      console.error('Failed to delete clinic', err);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading clinic...</p>;
  if (error || !clinic)
    return <p className="text-red-600">{error || 'Clinic not found'}</p>;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="mb-4 px-3 py-1 text-blue-600 rounded border border-transparent hover:border-blue-600 hover:text-blue-800 transition cursor-pointer"
      >
        ← Back to Clinics
      </button>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{clinic.name}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/admin/clinics/${clinic.id}`)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

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
        <p>
          <strong>Created:</strong>{' '}
          {new Date(clinic.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Updated:</strong>{' '}
          {new Date(clinic.updatedAt).toLocaleString()}
        </p>
      </div>

      {clinic.doctors && clinic.doctors.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Doctors</h2>

          <input
            type="text"
            placeholder="Search doctors by name, email, phone or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded shadow-sm"
          />

          <DoctorList doctors={clinic.doctors ?? []} search={search} />
        </div>
      )}

      {isConfirmOpen && (
        <ConfirmModal
          title="Confirm deletion"
          message={`Are you sure you want to delete clinic "${clinic.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDeleteClinic}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </div>
  );
}
