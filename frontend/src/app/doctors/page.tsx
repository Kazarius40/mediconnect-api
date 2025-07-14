'use client';

import React, { useEffect, useState } from 'react';
import doctorService from '@/services/doctor.service';
import { Doctor } from '@/interfaces/doctor';

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    doctorService
      .getAll()
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load doctors');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Doctors</h1>
      {doctors.map((doctor) => (
        <div
          key={doctor.id}
          className="border rounded p-4 shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold">{doctor.firstName}</h2>

          {doctor.services?.length ? (
            <p className="text-sm text-gray-700">
              <strong>Services:</strong>{' '}
              {doctor.services.map((s) => s.name).join(', ')}
            </p>
          ) : (
            <p className="text-sm text-gray-500">No services listed</p>
          )}

          {doctor.clinics?.length ? (
            <p className="text-sm text-gray-700">
              <strong>Clinics:</strong>{' '}
              {doctor.clinics.map((c) => c.name).join(', ')}
            </p>
          ) : (
            <p className="text-sm text-gray-500">No clinics assigned</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DoctorsPage;
