'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import clinicService from '@/services/clinic.service';
import { Clinic } from '@/interfaces/clinic';

export default function ClinicDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!id) return;

    clinicService
      .getById(Number(id))
      .then((res) => setClinic(res.data))
      .catch(() => setError('Failed to load clinic details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading clinic...</p>;
  if (error || !clinic)
    return (
      <p className="text-red-600">{error || 'ClinicInterface not found'}</p>
    );

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

      <h1 className="text-3xl font-bold mb-2">{clinic.name}</h1>

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
    </div>
  );
}
