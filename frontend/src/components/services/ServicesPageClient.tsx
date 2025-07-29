'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Service } from '@/interfaces/service';
import { matchesSearch } from '@/utils/common/search.util';
import SortControls from '@/components/common/SortControls';
import ServiceCard from '@/components/services/ServiceCard';
import { useAuth } from '@/providers/AuthProvider';

type SortableFields = keyof Pick<Service, 'name'>;

export default function ServicesPageClient({
  services,
}: {
  services: Service[];
}) {
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
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Services</h1>

      {user?.role === 'ADMIN' && (
        <button
          onClick={() => router.push('/admin/services/create')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Create Service
        </button>
      )}

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search services by name or description"
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
        <p className="text-gray-500">No services found.</p>
      )}

      {filteredAndSorted.map((service) => (
        <ServiceCard
          key={service.id}
          name={service.name}
          description={service.description}
          onClick={() => router.push(`/services/${service.id}`)}
        />
      ))}
    </div>
  );
}
