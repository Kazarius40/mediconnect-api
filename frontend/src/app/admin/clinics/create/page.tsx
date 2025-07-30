import { redirect } from 'next/navigation';
import ClinicForm from '@/components/clinics/ClinicForm';
import { EntityHeader } from '@/components/common/EntityHeader';
import { BACKEND_URL } from '@/config/backend';
import { Doctor } from '@/interfaces/doctor';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';

async function getDoctorsFromServer(
  token: string,
): Promise<Pick<Doctor, 'id' | 'firstName' | 'lastName'>[]> {
  const res = await fetch(`${BACKEND_URL}/doctors`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Failed to fetch doctors', await res.text());
    return [];
  }

  return res.json();
}

export default async function ClinicCreate() {
  const authResult = await ssrFetchUser();
  const user = authResult.user;
  const token = authResult.accessToken;

  if (!user || user.role !== 'ADMIN' || !token) {
    redirect('/');
  }

  const doctors = token ? await getDoctorsFromServer(token) : [];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <EntityHeader
        title="Create Clinic"
        editPath=""
        backText="Back to Clinics"
        isAdmin={false}
      />

      <ClinicForm allDoctors={doctors} />
    </div>
  );
}
