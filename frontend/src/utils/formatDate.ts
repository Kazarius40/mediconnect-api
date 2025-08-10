export function formatDate(value?: string): string {
  if (!value) return '-';
  try {
    return new Date(value).toISOString();
  } catch {
    return '-';
  }
}
