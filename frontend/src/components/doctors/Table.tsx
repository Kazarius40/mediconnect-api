'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Doctor } from '@/interfaces/doctor';
import { matchesSearch } from '@/utils/common/search.util';
import { SortControls } from '@/components/common/sort-controls';
import Card from '@/components/doctor/Card';
import { useAuth } from '@/providers/AuthProvider';
import { StringKeysOf } from '@/utils/common/filter.util';

import './style.css';

type SortableFields = StringKeysOf<Doctor>;

export default function Table({ doctors }: { doctors: Doctor[] }) {
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

  const DOCTOR_SEARCH_FIELDS = [
    'firstName',
    'lastName',
    'phone',
    'email',
  ] as const;

  const filteredAndSorted = useMemo(() => {
    const filtered = doctors.filter((doctor) =>
      matchesSearch(
        searchTerm,
        DOCTOR_SEARCH_FIELDS.map((f) => doctor[f] ?? ''),
      ),
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
    <div className="wrapper">
      <h1>Doctors</h1>

      {user?.role === 'ADMIN' && (
        <button onClick={() => router.push('/admin/doctors/create')}>
          + Create Doctor
        </button>
      )}

      <label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search doctors by name, phone or email"
        />
      </label>

      <SortControls<SortableFields>
        sortFields={sortFields}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChangeAction={setSortBy}
        onSortOrderChangeAction={setSortOrder}
      />

      {filteredAndSorted.length === 0 && <p>No doctors found.</p>}

      {filteredAndSorted.map((doctor) => (
        <Card
          key={doctor.id}
          doctor={doctor}
          onClick={() => router.push(`/doctors/${doctor.id}`)}
        />
      ))}
    </div>
  );
}
