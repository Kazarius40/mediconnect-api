'use client';

import React from 'react';
import { Doctor } from '@/interfaces/doctor';
import { sortByFields, sortByName } from '@/utils/common/sort.util';
import { matchesSearch } from '@/utils/common/search.util';

interface DoctorListProps {
  doctors: Doctor[];
  search?: string;
}

export function DoctorList({ doctors, search = '' }: DoctorListProps) {
  const sortedDoctors = sortByFields(doctors, ['lastName', 'firstName']);

  const filteredDoctors = sortedDoctors.filter((doc) =>
    matchesSearch(search, [
      doc.firstName,
      doc.lastName,
      doc.email,
      doc.phone,
      ...(doc.services?.flatMap((s) => [s.name, s.description || undefined]) ??
        []),
    ]),
  );

  if (!filteredDoctors.length) {
    return <p className="text-gray-500">No doctors match your search.</p>;
  }

  return (
    <ul className="space-y-2">
      {filteredDoctors.map((doc) => {
        const sortedServices = doc.services ? sortByName(doc.services) : [];

        return (
          <li key={doc.id} className="border p-3 rounded shadow-sm">
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
            {sortedServices.length ? (
              <div className="mt-2">
                <strong>Services:</strong>
                <ul className="list-disc ml-5 mt-1">
                  {sortedServices.map((s) => (
                    <li key={s.id}>
                      <span className="font-medium">{s.name}</span>
                      {s.description && (
                        <p className="text-sm text-gray-600">{s.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 mt-1">No services listed</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
