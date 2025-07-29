import { BACKEND_URL } from '@/config/backend';

export async function fetchWithAuth(token: string, path: string) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed to fetch ${path}`, text);
    throw new Error(text);
  }
  return res.json();
}

export function getServicesFromServer(token: string) {
  return fetchWithAuth(token, '/services');
}

export function getServiceFromServer(token: string, id: number) {
  return fetchWithAuth(token, `/services/${id}`);
}

export function getDoctorsFromServer(token: string) {
  return fetchWithAuth(token, '/doctors');
}

export function getDoctorFromServer(token: string, id: number) {
  return fetchWithAuth(token, `/doctors/${id}`);
}

export function getAllUsersFromServer(token: string) {
  return fetchWithAuth(token, '/auth/users');
}

export function getUserDetailsFromServer(token: string, id: number) {
  return fetchWithAuth(token, `/auth/users/${id}`);
}
