'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Doctor } from '@/interfaces/doctor';
import { matchesSearch } from '@/utils/common/search.util';
import SortControls from '@/components/common/SortControls';
import DoctorCard from '@/components/doctors/DoctorCard';
import { useAuth } from '@/providers/AuthProvider';

type SortableFields = keyof Pick<Doctor, 'firstName' | 'lastName' | 'email'>;

export default function DoctorsPageClient({ doctors }: { doctors: Doctor[] }) {
  const router = useRouter();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortableFields>('lastName');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const sortFields: { value: SortableFields; label: string }[] = [
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'email', label: 'Email' },
  ];

  const filteredAndSorted = useMemo(() => {
    const filtered = doctors.filter((doctor) =>
      matchesSearch(searchTerm, [
        doctor.firstName,
        doctor.lastName,
        doctor.phone,
        doctor.email,
      ]),
    );

    return filtered.sort((a, b) => {
      const fieldA = String(a[sortBy] ?? '');
      const fieldB = String(b[sortBy] ?? '');
      return sortOrder === 'ASC'
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    });
  }, [doctors, searchTerm, sortBy, sortOrder]);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Doctors</h1>

      {user?.role === 'ADMIN' && (
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

      <SortControls<SortableFields>
        sortFields={sortFields}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
      />

      {filteredAndSorted.length === 0 && (
        <p className="text-gray-500">No doctors found.</p>
      )}

      {filteredAndSorted.map((doctor) => (
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
}
