'use client';

import { Doctor } from '@/interfaces/doctor';
import { sortByFields } from '@/utils/common/sort.util';
import { matchesSearch } from '@/utils/common/search.util';

import './style.css';

interface DoctorListProps {
  doctors: Doctor[];
  search?: string;
  mode?: 'default' | 'withClinics';
}

export function List({
  doctors,
  search = '',
  mode = 'default',
}: DoctorListProps) {
  const sortedDoctors = sortByFields(doctors, ['lastName', 'firstName']);

  const filteredDoctors = sortedDoctors.filter((doc) =>
    matchesSearch(search, [
      doc.firstName,
      doc.lastName,
      doc.email,
      doc.phone,
      ...(doc.services?.flatMap((s) => [s.name, s.description || null]) ?? []),
      ...(doc.clinics?.flatMap((c) => [c.name, c.address, c.email || null]) ??
        []),
    ]),
  );

  if (!filteredDoctors.length) {
    return <p className="doctor-empty">No doctors match your search.</p>;
  }

  return (
    <ul className="doctor-list">
      {filteredDoctors.map((doc) => {
        const sortedServices = doc.services
          ? sortByFields(doc.services, ['name', 'description'])
          : [];
        const sortedClinics = doc.clinics
          ? sortByFields(doc.clinics, ['name', 'address'])
          : [];

        return (
          <li key={doc.id} className="doctor-list-item">
            <p>
              <strong>Name:</strong> {doc.lastName} {doc.firstName}
            </p>
            {doc.email && (
              <p>
                <strong>Email:</strong> {doc.email}
              </p>
            )}
            {doc.phone && (
              <p>
                <strong>Phone:</strong> {doc.phone}
              </p>
            )}

            {mode === 'default' && (
              <>
                {sortedServices.length ? (
                  <div className="doctor-subsection">
                    <strong>Services:</strong>
                    <ul className="doctor-sublist">
                      {sortedServices.map((s) => (
                        <li key={s.id}>
                          <span className="doctor-item-title">{s.name}</span>
                          {s.description && (
                            <p className="doctor-item-sub">{s.description}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="doctor-empty">No services listed</p>
                )}
              </>
            )}

            {mode === 'withClinics' && (
              <>
                {sortedClinics.length ? (
                  <div className="doctor-subsection">
                    <strong>Clinics:</strong>
                    <ul className="doctor-sublist">
                      {sortedClinics.map((c) => (
                        <li key={c.id}>
                          <span className="doctor-item-title">{c.name}</span>
                          <p className="doctor-item-sub">
                            {c.address}
                            {c.phone && ` • ${c.phone}`}
                            {c.email && ` • ${c.email}`}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="doctor-empty">No clinics listed</p>
                )}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
