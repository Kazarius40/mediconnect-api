'use server';

import { redirect } from 'next/navigation';
import ClinicForm from '@/components/clinics/ClinicForm';
import { EntityHeader } from '@/components/common/EntityHeader';
import { Doctor } from '@/interfaces/doctor';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';
import { FRONTEND_URL } from '@/config/frontend';

export default async function ClinicCreate() {
  const authResult = await ssrFetchUser();
  const user = authResult.user;

  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  const res = await fetch(`${FRONTEND_URL}/api/doctors`, { cache: 'no-store' });

  if (!res.ok) {
    console.error('Failed to fetch doctors', await res.text());
    redirect('/clinics');
  }

  const {
    doctors,
  }: { doctors: Pick<Doctor, 'id' | 'firstName' | 'lastName'>[] } =
    await res.json();

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
