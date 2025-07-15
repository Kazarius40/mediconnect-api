'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import clinicService from '@/services/clinic.service';
import { Clinic } from '@/interfaces/clinic';
import { ConfirmModal } from '@/components/common/ConfirmModal';

export default function ClinicDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    clinicService
      .getById(Number(id))
      .then((data) => setClinic(data))
      .catch(() => setError('Failed to load clinic details'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDeleteClinic = async () => {
    if (!clinic) return;
    setLoading(true);
    try {
      await clinicService.delete(clinic.id);
      router.push('/clinics');
    } catch (err) {
      console.error('Failed to delete clinic', err);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading clinic...</p>;
  if (error || !clinic)
    return <p className="text-red-600">{error || 'Clinic not found'}</p>;

  const filteredDoctors = clinic.doctors?.filter((doc) => {
    const searchLower = search.toLowerCase();
    return (
      doc.firstName.toLowerCase().includes(searchLower) ||
      doc.lastName.toLowerCase().includes(searchLower) ||
      (doc.email?.toLowerCase().includes(searchLower) ?? false) ||
      (doc.phone?.toLowerCase().includes(searchLower) ?? false) ||
      doc.services?.some(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.description?.toLowerCase().includes(searchLower),
      )
    );
  });

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
            onClick={() => router.push(`/clinics/${clinic.id}/edit`)}
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

          {filteredDoctors && filteredDoctors.length > 0 ? (
            <ul className="space-y-2">
              {filteredDoctors.map((doc) => (
                <li key={doc.id} className="border p-3 rounded shadow-sm">
                  <p>
                    <strong>Name:</strong> {doc.firstName} {doc.lastName}
                  </p>
                  {doc.email && (
                    <p>
                      <strong>Email:</strong> {doc.email}
                    </p>
                  )}
                  {doc.phone && (
                    <p>
                      <strong>Phone:</strong> {doc.phone}
                    </p>
                  )}
                  {doc.services?.length ? (
                    <div className="mt-2">
                      <strong>Services:</strong>
                      <ul className="list-disc ml-5 mt-1">
                        {doc.services.map((s) => (
                          <li key={s.id}>
                            <span className="font-medium">{s.name}</span>
                            {s.description && (
                              <p className="text-sm text-gray-600">
                                {s.description}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-1">No services listed</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No doctors match your search.</p>
          )}
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
