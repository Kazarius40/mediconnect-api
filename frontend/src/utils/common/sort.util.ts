export function sortByFields<T>(
  items: T[],
  fields: (keyof T)[],
  direction: 'asc' | 'desc' = 'asc',
): T[] {
  return [...items].sort((a, b) => {
    const aKey = fields.map((f) => String(a[f] ?? '')).join(' ');
    const bKey = fields.map((f) => String(b[f] ?? '')).join(' ');
    const result = aKey.localeCompare(bKey);
    return direction === 'asc' ? result : -result;
  });
}
