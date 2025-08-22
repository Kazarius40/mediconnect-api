'use client';

import './style.css';
import { Clinic } from '@/interfaces/clinic';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { List } from '@/components/doctor/List';
import { useEntityDeleteHook } from '@/hooks/entity/useEntityDelete.hook';
import { EntityHeader } from '@/components/common/EntityHeader';
import { EntityDates } from '@/components/common/EntityDates';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useSortedSearch } from '@/hooks/common/useSortedSearch';
import { sortByFields } from '@/utils/common/sort.util';

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

  const DOCTOR_SORT_FIELDS = ['lastName', 'firstName'] as const;
  const DOCTOR_SEARCH_FIELDS = [
    'firstName',
    'lastName',
    'email',
    'phone',
  ] as const;

  const {
    search,
    setSearch,
    filteredItems: filteredDoctors,
  } = useSortedSearch(
    doctors,
    (items) => sortByFields(items, [...DOCTOR_SORT_FIELDS]),
    [...DOCTOR_SEARCH_FIELDS],
  );

  return (
    <div className="clinic-container">
      <EntityHeader
        title={clinic.name}
        editPath={`/admin/clinics/${clinic.id}`}
        backText="Back to Clinics"
        onDeleteClick={() => setIsConfirmOpen(true)}
        showControls={isAdmin}
      />

      <div className="clinic-info">
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

      <div className="doctors-section">
        <h2>Doctors</h2>
        {doctors.length > 0 && (
          <input
            type="text"
            placeholder="Search doctors by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="doctors-search"
          />
        )}
        {filteredDoctors.length > 0 ? (
          <List doctors={filteredDoctors} search={search} />
        ) : (
          <p className="text-muted">
            {doctors.length === 0 ? 'No doctors linked' : 'No matching doctors'}
          </p>
        )}
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
