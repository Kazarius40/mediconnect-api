import { useState, useMemo } from 'react';
import { sortAndFilter } from '@/utils/common/filter.util';

export function useSortedSearch<T>(
  items: T[],
  sortFn: (items: T[]) => T[],
  fields: (keyof T)[],
) {
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(
    () => sortAndFilter(items, sortFn, search, fields),
    [items, search, sortFn, fields],
  );

  return { search, setSearch, filteredItems };
}
