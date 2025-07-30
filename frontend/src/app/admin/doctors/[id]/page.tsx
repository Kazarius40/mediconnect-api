import { redirect } from 'next/navigation';
import DoctorForm from '@/components/doctors/DoctorForm';
import { EntityHeader } from '@/components/common/EntityHeader';
import { getDoctorFromServer, getServicesFromServer } from '@/lib/api';
import { getClinics } from '@/lib/api/clinics';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';

export default async function DoctorEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const doctorId = Number(resolvedParams.id);

  if (!doctorId) redirect('/doctors');

  const authResult = await ssrFetchUser();
  const user = authResult.user;
  const token = authResult.accessToken;

  if (!user || user.role !== 'ADMIN' || !token) {
    redirect('/');
  }

  try {
    const [doctor, clinics, services] = await Promise.all([
      getDoctorFromServer(token, doctorId),
      getClinics(),
      getServicesFromServer(token),
    ]);

    return (
      <div className="max-w-3xl mx-auto p-4">
        <EntityHeader
          title="Edit Doctor"
          editPath=""
          backText="Back to Doctors"
          isAdmin={false}
        />

        <DoctorForm
          doctorId={doctor.id}
          allClinics={clinics}
          allServices={services}
          initialValues={{
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            phone: doctor.phone,
            email: doctor.email,
            clinicIds: doctor.clinics?.map((c: any) => c.id) || [],
            serviceIds: doctor.services?.map((s: any) => s.id) || [],
          }}
        />
      </div>
    );
  } catch (error) {
    return (
      <p className="text-red-600 text-center mt-4">
        Doctor not found or failed to load data
      </p>
    );
  }
}
