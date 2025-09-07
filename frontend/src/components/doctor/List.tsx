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
      ...(doc.services?.flatMap((s) =>
        [s.name, s.description].filter(Boolean),
      ) ?? []),
      ...(doc.clinics?.flatMap((c) =>
        [c.name, c.address, c.email].filter(Boolean),
      ) ?? []),
    ]),
  );

  if (!filteredDoctors.length) {
    return <p>No match your search.</p>;
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
          <li key={doc.id} className="doctor-list__item">
            <p className="doctor-list__name">
              <strong>Name:</strong> {doc.lastName} {doc.firstName}
            </p>
            {doc.email && (
              <p className="doctor-list__email">
                <strong>Email:</strong> {doc.email}
              </p>
            )}
            {doc.phone && (
              <p className="doctor-list__phone">
                <strong>Phone:</strong> {doc.phone}
              </p>
            )}

            {mode === 'default' && sortedServices.length > 0 && (
              <div className="doctor-list__section">
                <strong className="doctor-list__section-title">
                  Services:
                </strong>
                <ul className="doctor-list__sublist">
                  {sortedServices.map((s) => (
                    <li key={s.id} className="doctor-list__sublist-item">
                      <span className="doctor-list__sublist-item-name">
                        {s.name}
                      </span>
                      {s.description && (
                        <p className="doctor-list__sublist-item">
                          {s.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {mode === 'withClinics' && sortedClinics.length > 0 && (
              <div className="doctor-list__section">
                <strong className="doctor-list__section-title">Clinics:</strong>
                <ul className="doctor-list__sublist">
                  {sortedClinics.map((c) => (
                    <li key={c.id} className="doctor-list__sublist-item">
                      <span className="doctor-list__sublist-item-name">
                        {c.name}
                      </span>
                      <p className="doctor-list__sublist-item">
                        {c.address}
                        {c.phone && ` • ${c.phone}`}
                        {c.email && ` • ${c.email}`}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
