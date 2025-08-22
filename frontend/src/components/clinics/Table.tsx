'use client';

import { useMemo, useState } from 'react';
import Card from '@/components/clinic/Card';
import { useRouter } from 'next/navigation';
import { Clinic } from '@/interfaces/clinic';
import { matchesSearch } from '@/utils/common/search.util';
import { SortControls } from '@/components/common/SortControls';
import { useAuth } from '@/providers/AuthProvider';
import { StringKeysOf } from '@/utils/common/filter.util';

import './style.css';

type SortableFields = StringKeysOf<Clinic>;

export default function Table({ clinics }: { clinics: Clinic[] }) {
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
    <div className="container">
      <h1 className="title">Clinics</h1>

      {user?.role === 'ADMIN' && (
        <button
          onClick={() => router.push('/admin/clinics/create')}
          className="btn-create"
        >
          + Create Clinic
        </button>
      )}

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search clinics by name, address, phone or email"
        className="search-input"
      />

      <SortControls<SortableFields>
        sortFields={sortFields}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChangeAction={setSortBy}
        onSortOrderChangeAction={setSortOrder}
      />

      {filteredAndSorted.length === 0 && (
        <p className="no-results">No clinics found.</p>
      )}

      {filteredAndSorted.map((clinic) => (
        <Card
          key={clinic.id}
          clinic={clinic}
          onClick={() => router.push(`/clinics/${clinic.id}`)}
        />
      ))}
    </div>
  );
}
