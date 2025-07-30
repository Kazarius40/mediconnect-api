import { redirect } from 'next/navigation';
import { BACKEND_URL } from '@/config/backend';
import { Doctor } from '@/interfaces/doctor';
import { Clinic } from '@/interfaces/clinic';
import { EntityHeader } from '@/components/common/EntityHeader';
import ClinicForm from '@/components/clinics/ClinicForm';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';

type ClinicWithDoctors = Omit<Clinic, 'doctors'> & {
  doctors: Pick<Doctor, 'id' | 'firstName' | 'lastName'>[];
};

async function getDoctorsFromServer(
  token: string,
): Promise<Pick<Doctor, 'id' | 'firstName' | 'lastName'>[]> {
  const res = await fetch(`${BACKEND_URL}/doctors`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Failed to fetch doctors', await res.text());
    return [];
  }

  return res.json();
}

async function getClinicFromServer(
  token: string,
  id: number,
): Promise<ClinicWithDoctors | null> {
  const res = await fetch(`${BACKEND_URL}/clinics/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Failed to fetch clinic', await res.text());
    return null;
  }

  return res.json();
}

export default async function ClinicEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const clinicId = Number(resolvedParams.id);

  if (!clinicId) redirect('/clinics');

  const authResult = await ssrFetchUser();
  const user = authResult.user;
  const token = authResult.accessToken;

  if (!user || user.role !== 'ADMIN' || !token) {
    redirect('/');
  }

  const [clinic, doctors] = await Promise.all([
    getClinicFromServer(token, clinicId),
    getDoctorsFromServer(token),
  ]);

  if (!clinic) {
    return <p className="text-red-600 text-center mt-4">Clinic not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <EntityHeader
        title="Edit Clinic"
        editPath=""
        backText="Back to Clinics"
        isAdmin={false}
      />

      <ClinicForm
        clinicId={clinic.id}
        allDoctors={doctors}
        initialValues={{
          name: clinic.name,
          address: clinic.address,
          phone: clinic.phone,
          email: clinic.email,
          doctorIds: clinic.doctors?.map((d) => d.id) || [],
        }}
      />
    </div>
  );
}
