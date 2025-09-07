'use client';

import { Doctor } from '@/interfaces/doctor';
import { useEntityDeleteHook } from '@/hooks/entity/useEntityDelete.hook';
import { EntityHeader } from '@/components/common/entity-header';
import { EntityDates } from '@/components/common/entity-dates';
import { useAuth } from '@/providers/AuthProvider';
import { useSortedSearch } from '@/hooks/common/useSortedSearch';
import { useRouter } from 'next/navigation';
import { sortByFields } from '@/utils/common/sort.util';
import { ConfirmModal } from '@/components/common/confirm-modal';

import './style.css';

export default function Details({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const services = doctor.services ?? [];
  const clinics = doctor.clinics ?? [];

  const { isConfirmOpen, setIsConfirmOpen, handleDelete } = useEntityDeleteHook(
    async (id) => {
      await fetch(`/api/admin/doctors/${id}`, {
        method: 'DELETE',
      });
      router.push('/doctors');
    },
    '/doctors',
  );

  const SERVICE_SORT_FIELDS = ['name', 'description'] as const;
  const SERVICE_SEARCH_FIELDS = ['name', 'description'] as const;

  const {
    search: serviceSearch,
    setSearch: setServiceSearch,
    filteredItems: filteredServices,
  } = useSortedSearch(
    services,
    (items) => sortByFields(items, [...SERVICE_SORT_FIELDS]),
    [...SERVICE_SEARCH_FIELDS],
  );

  const CLINIC_SORT_FIELDS = ['name', 'address', 'phone', 'email'] as const;
  const CLINIC_SEARCH_FIELDS = ['name', 'address', 'phone', 'email'] as const;

  const {
    search: clinicSearch,
    setSearch: setClinicSearch,
    filteredItems: filteredClinics,
  } = useSortedSearch(
    clinics,
    (items) => sortByFields(items, [...CLINIC_SORT_FIELDS]),
    [...CLINIC_SEARCH_FIELDS],
  );

  return (
    <div className="details-wrapper">
      <EntityHeader
        title={`${doctor.lastName} ${doctor.firstName}`}
        editPath={`/admin/doctors/${doctor.id}`}
        backText="Back to Doctors"
        onDeleteClick={() => setIsConfirmOpen(true)}
        showControls={isAdmin}
      />

      <div>
        {doctor.phone && (
          <p>
            <strong>Phone:</strong> {doctor.phone}
          </p>
        )}
        {doctor.email && (
          <p>
            <strong>Email:</strong> {doctor.email}
          </p>
        )}
        <EntityDates
          createdAt={doctor.createdAt}
          updatedAt={doctor.updatedAt}
        />
      </div>

      <div className="entity-sections-row">
        <div className="entity-section">
          <h2>Services</h2>
          {services.length > 0 && (
            <input
              type="text"
              placeholder="Search services by name or description..."
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
            />
          )}
          {filteredServices.length > 0 ? (
            <ul>
              {filteredServices.map((s) => (
                <li key={s.id}>
                  <span>{s.name}</span>
                  <div>
                    <p>{s.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              {services.length === 0
                ? 'No services linked'
                : 'No matching services'}
            </p>
          )}
        </div>

        <div className="entity-section">
          <h2>Clinics</h2>
          {clinics.length > 0 && (
            <input
              type="text"
              placeholder="Search clinics by name, address, phone or email..."
              value={clinicSearch}
              onChange={(e) => setClinicSearch(e.target.value)}
            />
          )}
          {filteredClinics.length > 0 ? (
            <ul>
              {filteredClinics.map((c) => (
                <li key={c.id}>
                  <span>{c.name}</span>
                  <div>
                    <p>{c.address}</p>
                    <p>
                      <strong>Phone:</strong> {c.phone}
                    </p>
                    {c.email && (
                      <p>
                        <strong>Email:</strong> {c.email}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              {clinics.length === 0
                ? 'No clinics linked'
                : 'No matching clinics'}
            </p>
          )}
        </div>
      </div>

      {isConfirmOpen && (
        <ConfirmModal
          entity={{
            id: doctor.id,
            name: `${doctor.lastName} ${doctor.firstName}`,
          }}
          entityType="doctor"
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </div>
  );
}
