'use server';

import { redirect } from 'next/navigation';
import { EntityHeader } from '@/components/common/EntityHeader';
import ClinicForm from '@/components/clinics/ClinicForm';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';
import { FRONTEND_URL } from '@/config/frontend';
import { Doctor } from '@/interfaces/doctor';
import { Clinic } from '@/interfaces/clinic';

type DoctorShort = Pick<Doctor, 'id' | 'firstName' | 'lastName'>;
type ClinicWithDoctors = Omit<Clinic, 'doctors'> & { doctors: DoctorShort[] };

export default async function ClinicEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const clinicId = Number((await params).id);

  if (!clinicId) redirect('/clinics');

  const { user } = await ssrFetchUser();
  if (!user || user.role !== 'ADMIN') redirect('/');

  const [clinicRes, doctorsRes] = await Promise.all([
    fetch(`${FRONTEND_URL}/api/clinics/${clinicId}`, { cache: 'no-store' }),
    fetch(`${FRONTEND_URL}/api/doctors`, { cache: 'no-store' }),
  ]);

  if (!clinicRes.ok) {
    return (
      <p className="text-red-600 text-center mt-4">
        Clinic with id: {clinicId} not found
      </p>
    );
  }

  if (!doctorsRes.ok) {
    return (
      <p className="text-red-600 text-center mt-4">Failed to load doctors</p>
    );
  }

  const { clinic }: { clinic: ClinicWithDoctors } = await clinicRes.json();
  const { doctors }: { doctors: DoctorShort[] } = await doctorsRes.json();

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
