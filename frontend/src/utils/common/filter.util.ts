export function filterItems<T>(
  items: T[],
  query: string,
  fields: (keyof T)[],
): T[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter((item) =>
    fields.some((field) =>
      String(item[field] ?? '')
        .toLowerCase()
        .includes(q),
    ),
  );
}

export function sortAndFilter<T>(
  items: T[],
  sortFn: (items: T[]) => T[],
  query: string,
  fields: (keyof T)[],
): T[] {
  const sorted = sortFn(items);
  return filterItems(sorted, query, fields);
}
