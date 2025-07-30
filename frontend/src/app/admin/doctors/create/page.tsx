import DoctorForm from '@/components/doctors/DoctorForm';
import { EntityHeader } from '@/components/common/EntityHeader';
import { getClinics } from '@/lib/api/clinics';
import { getServicesFromServer } from '@/lib/api';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';
import { redirect } from 'next/navigation';

export default async function DoctorCreate() {
  const authResult = await ssrFetchUser();
  const user = authResult.user;
  const token = authResult.accessToken;

  if (!user || user.role !== 'ADMIN' || !token) {
    redirect('/');
  }

  const [clinics, services] = await Promise.all([
    getClinics(),
    getServicesFromServer(token),
  ]);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <EntityHeader
        title="Create Doctor"
        editPath=""
        backText="Back to Doctors"
        isAdmin={false}
      />

      <DoctorForm allClinics={clinics} allServices={services} />
    </div>
  );
}
