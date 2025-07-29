'use client';

import React, { useState, useMemo } from 'react';
import { sortByFields } from '@/utils/common/sort.util';

export interface MultiSelectOption {
  id: number;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  selectedIds: number[];
  onChangeAction: (newSelected: number[]) => void;
  sortFields?: (keyof MultiSelectOption)[];
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedIds,
  onChangeAction,
  sortFields = ['label'],
}) => {
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const selectedOptions = useMemo(
    () => options.filter((opt) => selectedIds.includes(opt.id)),
    [options, selectedIds],
  );

  const availableOptions = useMemo(
    () => options.filter((opt) => !selectedIds.includes(opt.id)),
    [options, selectedIds],
  );

  const sortedOptions = useMemo(
    () => sortByFields(availableOptions, sortFields, sortDir),
    [availableOptions, sortFields, sortDir],
  );

  const addOption = (id: number) => {
    if (!selectedIds.includes(id)) {
      onChangeAction([...selectedIds, id]);
    }
  };

  const removeOption = (id: number) => {
    onChangeAction(selectedIds.filter((sId) => sId !== id));
  };

  const toggleSortDir = () =>
    setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));

  return (
    <div className="mb-4">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <label className="block font-semibold">{label}</label>
          <button
            type="button"
            onClick={toggleSortDir}
            className="text-sm text-blue-600 hover:underline"
          >
            Sort {sortDir === 'asc' ? '↓' : '↑'}
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-2">
        {selectedOptions.map((opt) => (
          <div
            key={opt.id}
            className="flex items-center bg-blue-200 text-blue-800 px-2 py-1 rounded"
          >
            <span>{opt.label}</span>
            <button
              type="button"
              onClick={() => removeOption(opt.id)}
              className="ml-1 text-blue-600 hover:text-blue-900 font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <select
        className="w-full border p-2 rounded"
        onChange={(e) => {
          const id = Number(e.target.value);
          if (id) addOption(id);
          e.target.value = '';
        }}
        defaultValue=""
      >
        <option value="" disabled>
          Select an option to add
        </option>
        {sortedOptions.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
