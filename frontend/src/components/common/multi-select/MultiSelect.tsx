'use client';

import { useMemo, useState } from 'react';
import { sortByFields } from '@/utils/common/sort.util';

import './style.css';

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

export function MultiSelect({
  label,
  options,
  selectedIds,
  onChangeAction,
  sortFields = ['label'],
}: MultiSelectProps) {
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
    <div className="multi-select">
      {label && (
        <div className="multi-select-header">
          <label className="multi-select-label">{label}</label>
          <button
            type="button"
            onClick={toggleSortDir}
            className="multi-select-sort-button"
          >
            Sort {sortDir === 'asc' ? '↓' : '↑'}
          </button>
        </div>
      )}

      <div className="multi-select-selected">
        {selectedOptions.map((opt) => (
          <div key={opt.id} className="multi-select-chip">
            <span>{opt.label}</span>
            <button
              type="button"
              onClick={() => removeOption(opt.id)}
              className="multi-select-chip-remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <select
        className="multi-select-dropdown"
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
}
