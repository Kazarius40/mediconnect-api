'use client';

import React, { useEffect, useState } from 'react';
import ClinicCard from '@/components/clinics/ClinicCard';
import { useRouter } from 'next/navigation';
import clinicApi from '@/services/clinicApi';
import { Clinic } from '@/interfaces/clinic';
import { matchesSearch } from '@/utils/common/search.util';
import SortControls from '@/components/common/SortControls';
import { authProvider } from '@/providers/AuthProvider';

const ClinicsPage: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const { user, loading: userLoading } = authProvider();
  const router = useRouter();

  const sortFields = [
    { value: 'name', label: 'Name' },
    { value: 'address', label: 'Address' },
    { value: 'email', label: 'Email' },
  ];

  const loadClinics = async () => {
    setLoading(true);
    try {
      const data = await clinicApi.getAll({
        sortBy,
        sortOrder,
      });
      setClinics(data);
    } catch (e) {
      setError('Failed to load clinics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadClinics();
  }, [sortBy, sortOrder]);

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
        placeholder="Search clinics by name, address, phone or email"
        className="w-full max-w-md p-2 border rounded mb-4"
      />

      <SortControls
        sortFields={sortFields}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
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
          email={clinic.email}
          onClick={() => router.push(`/clinics/${clinic.id}`)}
        />
      ))}
    </div>
  );
};

export default ClinicsPage;
