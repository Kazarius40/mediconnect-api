'use client';

import React from 'react';

export const EntityDates: React.FC<{
  createdAt?: string;
  updatedAt?: string;
}> = ({ createdAt, updatedAt }) => (
  <>
    {createdAt && (
      <p>
        <strong>Created:</strong> {new Date(createdAt).toLocaleString()}
      </p>
    )}
    {updatedAt && (
      <p>
        <strong>Updated:</strong> {new Date(updatedAt).toLocaleString()}
      </p>
    )}
  </>
);
