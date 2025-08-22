'use client';

type SortControlsProps<T extends string> = {
  sortFields: { value: T; label: string }[];
  sortBy: T;
  sortOrder: 'ASC' | 'DESC';
  onSortByChangeAction: (field: T) => void;
  onSortOrderChangeAction: (order: 'ASC' | 'DESC') => void;
};

export const SortControls = <T extends string>({
  sortFields,
  sortBy,
  sortOrder,
  onSortByChangeAction,
  onSortOrderChangeAction,
}: SortControlsProps<T>) => {
  return (
    <div className="flex gap-4 mb-4">
      <select
        value={sortBy}
        onChange={(e) => onSortByChangeAction(e.target.value as T)}
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
        onChange={(e) =>
          onSortOrderChangeAction(e.target.value as 'ASC' | 'DESC')
        }
        className="border p-2 rounded"
      >
        <option value="ASC">Ascending ↑</option>
        <option value="DESC">Descending ↓</option>
      </select>
    </div>
  );
};
