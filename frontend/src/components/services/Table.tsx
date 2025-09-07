'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Service } from '@/interfaces/service';
import { matchesSearch } from '@/utils/common/search.util';
import { SortControls } from '@/components/common/sort-controls';
import Card from '@/components/service/Card';
import { useAuth } from '@/providers/AuthProvider';
import { StringKeysOf } from '@/utils/common/filter.util';

import './style.css';

type SortableFields = StringKeysOf<Service>;

export default function Table({ services }: { services: Service[] }) {
  const router = useRouter();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortableFields>('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const sortFields: { value: SortableFields; label: string }[] = [
    { value: 'name', label: 'Name' },
  ];

  const filteredAndSorted = useMemo(() => {
    const filtered = services.filter((service) =>
      matchesSearch(searchTerm, [service.name, service.description]),
    );

    return filtered.sort((a, b) => {
      const fieldA = String(a[sortBy] ?? '');
      const fieldB = String(b[sortBy] ?? '');
      return sortOrder === 'ASC'
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    });
  }, [services, searchTerm, sortBy, sortOrder]);

  return (
    <div className="services-wrapper">
      <h1>Services</h1>

      {user?.role === 'ADMIN' && (
        <button onClick={() => router.push('/admin/services/create')}>
          + Create Service
        </button>
      )}

      <label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search services by name or description"
        />
      </label>

      <SortControls<SortableFields>
        sortFields={sortFields}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChangeAction={setSortBy}
        onSortOrderChangeAction={setSortOrder}
      />

      {filteredAndSorted.length === 0 && <p>No services found.</p>}

      {filteredAndSorted.map((service) => (
        <Card
          key={service.id}
          service={service}
          onClick={() => router.push(`/services/${service.id}`)}
        />
      ))}
    </div>
  );
}
