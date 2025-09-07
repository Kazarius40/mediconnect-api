'use client';

import { Clinic } from '@/interfaces/clinic';
import { List } from '@/components/doctor/List';
import { useEntityDeleteHook } from '@/hooks/entity/useEntityDelete.hook';
import { EntityHeader } from '@/components/common/entity-header';
import { EntityDates } from '@/components/common/entity-dates';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useSortedSearch } from '@/hooks/common/useSortedSearch';
import { sortByFields } from '@/utils/common/sort.util';
import { ConfirmModal } from '@/components/common/confirm-modal';

import './style.css';

export default function Details({ clinic }: { clinic: Clinic }) {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const doctors = clinic.doctors ?? [];

  const { isConfirmOpen, setIsConfirmOpen, handleDelete } = useEntityDeleteHook(
    async (id) => {
      await fetch(`/api/admin/clinics/${id}`, { method: 'DELETE' });
      router.push('/clinics');
    },
    '/clinics',
  );

  const { search, setSearch } = useSortedSearch(
    doctors,
    (items) => sortByFields(items, ['lastName', 'firstName']),
    [],
  );

  return (
    <div className="details-wrapper">
      <EntityHeader
        title={clinic.name}
        editPath={`/admin/clinics/${clinic.id}`}
        backText="Back to Clinics"
        onDeleteClick={() => setIsConfirmOpen(true)}
        showControls={isAdmin}
      />

      <div>
        <p>
          <strong>Address:</strong> {clinic.address}
        </p>
        <p>
          <strong>Phone:</strong> {clinic.phone}
        </p>
        {clinic.email && (
          <p>
            <strong>Email:</strong> {clinic.email}
          </p>
        )}
        <EntityDates
          createdAt={clinic.createdAt}
          updatedAt={clinic.updatedAt}
        />
      </div>

      <div className="entity-section">
        <h2>Doctors</h2>

        {doctors.length > 0 && (
          <input
            type="text"
            placeholder="Search doctors or services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
        <List doctors={doctors} search={search} />
      </div>

      {isConfirmOpen && (
        <ConfirmModal
          entity={{ id: clinic.id, name: clinic.name }}
          entityType="clinic"
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </div>
  );
}
