'use client';

import React, { useEffect, useState } from 'react';
import DoctorCard from '@/components/doctors/DoctorCard';
import { useRouter } from 'next/navigation';
import doctorApi from '@/services/doctorApi';
import { Doctor } from '@/interfaces/doctor';
import { useUser } from '@/hooks/useUser';
import { matchesSearch } from '@/utils/common/search.util';
import SortControls from '@/components/common/SortControls';

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [sortBy, setSortBy] = useState<string>('firstName');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const { user, loading: userLoading } = useUser(false);
  const router = useRouter();

  const sortFields = [
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'email', label: 'Email' },
  ];

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorApi.getAll({
        sortBy,
        sortOrder,
      });
      setDoctors(data);
    } catch (e) {
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDoctors();
  }, [sortBy, sortOrder]);

  const filteredDoctors = doctors.filter((doctor) =>
    matchesSearch(searchTerm, [
      doctor.firstName,
      doctor.lastName,
      doctor.phone,
      doctor.email,
    ]),
  );

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Doctors</h1>

      {!userLoading && user?.role === 'ADMIN' && (
        <button
          onClick={() => router.push('/admin/doctors/create')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Create Doctor
        </button>
      )}

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search doctors by name, phone or email"
        className="w-full max-w-md p-2 border rounded mb-4"
      />

      <SortControls
        sortFields={sortFields}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
      />

      {filteredDoctors.length === 0 && (
        <p className="text-gray-500">No doctors found.</p>
      )}

      {filteredDoctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          firstName={doctor.firstName}
          lastName={doctor.lastName}
          phone={doctor.phone}
          email={doctor.email}
          onClick={() => router.push(`/doctors/${doctor.id}`)}
        />
      ))}
    </div>
  );
};

export default DoctorsPage;
