'use client';

import React, { useEffect, useState } from 'react';
import ClinicCard from '@/components/clinics/ClinicCard';
import { useRouter } from 'next/navigation';
import clinicApi from '@/services/clinicApi';
import { Clinic } from '@/interfaces/clinic';
import { useUser } from '@/hooks/useUser';
import { matchesSearch } from '@/utils/common/search.util';

const ClinicsPage: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { user, loading: userLoading } = useUser(false);
  const router = useRouter();

  useEffect(() => {
    clinicApi
      .getAll()
      .then((data) => {
        setClinics(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load clinics');
        setLoading(false);
      });
  }, []);

  const filteredClinics = clinics.filter((clinic) =>
    matchesSearch(searchTerm, [
      clinic.name,
      clinic.address,
      clinic.phone,
      clinic.email,
    ]),
  );

  if (loading) return <p>Loading clinics...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Clinics</h1>

      {!userLoading && user?.role === 'ADMIN' && (
        <button
          onClick={() => router.push('/admin/clinics/create')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Create Clinic
        </button>
      )}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search clinics by name, address, phone, or email"
        className="w-full max-w-md p-2 border rounded mb-4"
      />
      {filteredClinics.length === 0 && (
        <p className="text-gray-500">No clinics found.</p>
      )}
      {filteredClinics.map((clinic) => (
        <ClinicCard
          key={clinic.id}
          name={clinic.name}
          address={clinic.address}
          phone={clinic.phone}
          onClick={() => router.push(`/clinics/${clinic.id}`)}
        />
      ))}
    </div>
  );
};

export default ClinicsPage;
