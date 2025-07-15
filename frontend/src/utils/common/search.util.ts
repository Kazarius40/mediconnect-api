export const matchesSearch = (
  search: string,
  fields: (string | undefined)[],
) => {
  const term = search.trim().toLowerCase();
  if (!term) return true;
  return fields.some((f) => f?.toLowerCase().includes(term));
};
