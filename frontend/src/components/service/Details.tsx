'use client';

import { useState } from 'react';
import { Service } from '@/interfaces/service';
import { useEntityDeleteHook } from '@/hooks/entity/useEntityDelete.hook';
import { EntityHeader } from '@/components/common/entity-header';
import { List } from '@/components/doctor/List';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useSortedSearch } from '@/hooks/common/useSortedSearch';
import { sortByFields } from '@/utils/common/sort.util';
import { ConfirmModal } from '@/components/common/confirm-modal';
import { EntityDates } from '@/components/common/entity-dates';

import './style.css';

export default function Details({
  service: initialService,
}: {
  service: Service;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [service] = useState<Service>(initialService);

  const doctors = service.doctors ?? [];

  const { isConfirmOpen, setIsConfirmOpen, handleDelete } = useEntityDeleteHook(
    async (id) => {
      await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      router.push('/services');
    },
    '/services',
  );

  const { search, setSearch } = useSortedSearch(
    doctors,
    (items) => sortByFields(items, ['lastName', 'firstName']),
    [],
  );

  return (
    <div className="service-details-container">
      <EntityHeader
        title={service.name}
        editPath={`/admin/services/${service.id}`}
        backText="Back to Services"
        onDeleteClick={() => setIsConfirmOpen(true)}
        showControls={isAdmin}
      />

      <div className="service-details-info">
        <p>
          <strong>Description:</strong>{' '}
          {service.description || 'No description available'}
        </p>
        <EntityDates
          createdAt={service.createdAt}
          updatedAt={service.updatedAt}
        />
      </div>

      <div className="service-details-doctors">
        <h2 className="service-details-doctors-title">Doctors</h2>

        {doctors.length > 0 && (
          <input
            type="text"
            placeholder="Search doctors or clinics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="service-details-doctors-search"
          />
        )}

        <List doctors={doctors} search={search} mode="withClinics" />

        {doctors.length === 0 && (
          <p className="service-details-doctors-none">No doctors linked</p>
        )}
      </div>

      {isConfirmOpen && (
        <ConfirmModal
          entity={{ id: service.id, name: service.name }}
          entityType="service"
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </div>
  );
}
