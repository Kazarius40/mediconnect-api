'use client';

import React from 'react';
import { format } from 'date-fns';

export const EntityDates: React.FC<{
  createdAt?: string;
  updatedAt?: string;
}> = ({ createdAt, updatedAt }) => {
  const formatDate = (date: string) =>
    format(new Date(date), 'dd.MM.yyyy, HH:mm:ss');

  return (
    <>
      {createdAt && (
        <p>
          <strong>Created:</strong> {formatDate(createdAt)}
        </p>
      )}
      {updatedAt && (
        <p>
          <strong>Updated:</strong> {formatDate(updatedAt)}
        </p>
      )}
    </>
  );
};
