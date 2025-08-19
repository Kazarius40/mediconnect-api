import React from 'react';
import { formatDate } from '@/utils/common/format-date.util';

export const EntityDates: React.FC<{
  createdAt?: string;
  updatedAt?: string;
}> = ({ createdAt, updatedAt }) => {
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
