'use client';

import React, { useMemo, useState } from 'react';
import ClinicCard from '@/components/clinics/ClinicCard';
import { useRouter } from 'next/navigation';
import { Clinic } from '@/interfaces/clinic';
import { matchesSearch } from '@/utils/common/search.util';
import SortControls from '@/components/common/SortControls';
import { useAuth } from '@/providers/AuthProvider';
import { StringKeysOf } from '@/utils/common/filter.util';

type SortableFields = StringKeysOf<Clinic>;

export default function ClinicsComponent({ clinics }: { clinics: Clinic[] }) {
  const router = useRouter();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortableFields>('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const sortFields: { value: SortableFields; label: string }[] = [
    { value: 'name', label: 'Name' },
    { value: 'address', label: 'Address' },
    { value: 'email', label: 'Email' },
  ];

  const searchFields = ['name', 'address', 'phone', 'email'] as const;

  const filteredAndSorted = useMemo(() => {
    const filtered = clinics.filter((clinic) =>
      matchesSearch(
        searchTerm,
        searchFields.map((f) => clinic[f] ?? ''),
      ),
    );

    return filtered.sort((a, b) => {
      const fieldA = String(a[sortBy] ?? '');
      const fieldB = String(b[sortBy] ?? '');
      return sortOrder === 'ASC'
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    });
  }, [clinics, searchTerm, sortBy, sortOrder]);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Clinics</h1>

      {user?.role === 'ADMIN' && (
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

      <SortControls<SortableFields>
        sortFields={sortFields}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
      />

      {filteredAndSorted.length === 0 && (
        <p className="text-gray-500">No clinics found.</p>
      )}

      {filteredAndSorted.map((clinic) => (
        <ClinicCard
          key={clinic.id}
          clinic={clinic}
          onClick={() => router.push(`/clinics/${clinic.id}`)}
        />
      ))}
    </div>
  );
}
