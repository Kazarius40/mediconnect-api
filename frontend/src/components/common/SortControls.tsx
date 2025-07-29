'use client';

import React from 'react';

type SortControlsProps<T extends string> = {
  sortFields: { value: T; label: string }[];
  sortBy: T;
  sortOrder: 'ASC' | 'DESC';
  onSortByChange: (field: T) => void;
  onSortOrderChange: (order: 'ASC' | 'DESC') => void;
};

const SortControls = <T extends string>({
  sortFields,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: SortControlsProps<T>) => {
  return (
    <div className="flex gap-4 mb-4">
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as T)}
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
