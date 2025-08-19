import { format } from 'date-fns';

export function formatDate(value?: string): string {
  if (!value) return '-';
  try {
    return format(new Date(value), 'dd.MM.yyyy, HH:mm:ss');
  } catch {
    return '-';
  }
}
