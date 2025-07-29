import { BACKEND_URL } from '@/config/backend';

export async function fetchPublic(path: string) {
  const url = `${BACKEND_URL}${path}`;

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Public API Error [${res.status}] ${path}`, text);
    throw new Error(text);
  }

  return res.json();
}
