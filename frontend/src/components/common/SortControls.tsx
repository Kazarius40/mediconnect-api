'use client';

import React from 'react';

export interface SortField {
  value: string;
  label: string;
}

interface SortControlsProps {
  sortFields: SortField[];
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  onSortByChange: (field: string) => void;
  onSortOrderChange: (order: 'ASC' | 'DESC') => void;
}

const SortControls: React.FC<SortControlsProps> = ({
  sortFields,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}) => {
  return (
    <div className="flex gap-4 mb-4">
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="border p-2 rounded"
      >
        {sortFields.map((field) => (
          <option key={field.value} value={field.value}>
            Sort by {field.label}
          </option>
        ))}
      </select>

      <select
        value={sortOrder}
        onChange={(e) => onSortOrderChange(e.target.value as 'ASC' | 'DESC')}
        className="border p-2 rounded"
      >
        <option value="ASC">Ascending ↑</option>
        <option value="DESC">Descending ↓</option>
      </select>
    </div>
  );
};

export default SortControls;
