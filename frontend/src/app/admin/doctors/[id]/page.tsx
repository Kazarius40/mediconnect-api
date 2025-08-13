'use server';

import { redirect } from 'next/navigation';
import DoctorForm from '@/components/doctors/DoctorForm';
import { EntityHeader } from '@/components/common/EntityHeader';
import { ssrFetchUser } from '@/lib/auth/ssrAuth';
import { Clinic } from '@/interfaces/clinic';
import { Service } from '@/interfaces/service';
import { Doctor } from '@/interfaces/doctor';
import { FRONTEND_URL } from '@/config/frontend';

type ClinicShort = Pick<Clinic, 'id' | 'name'>;
type ServiceShort = Pick<Service, 'id' | 'name'>;
type DoctorFull = Omit<Doctor, 'clinics' | 'services'> & {
  clinics: ClinicShort[];
  services: ServiceShort[];
};

export default async function DoctorEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const doctorId = Number((await params).id);

  if (!doctorId) redirect('/doctors');

  const { user } = await ssrFetchUser();
  if (!user || user.role !== 'ADMIN') redirect('/');

  try {
    const [doctorRes, clinicsRes, servicesRes] = await Promise.all([
      fetch(`${FRONTEND_URL}/api/doctors/${doctorId}`, { cache: 'no-store' }),
      fetch(`${FRONTEND_URL}/api/clinics`, { cache: 'no-store' }),
      fetch(`${FRONTEND_URL}/api/services`, { cache: 'no-store' }),
    ]);

    if (!doctorRes.ok || !clinicsRes.ok || !servicesRes.ok) {
      return (
        <p className="text-red-600 text-center mt-4">Failed to load data</p>
      );
    }

    const { doctor }: { doctor: DoctorFull } = await doctorRes.json();
    const { clinics }: { clinics: ClinicShort[] } = await clinicsRes.json();
    const { services }: { services: ServiceShort[] } = await servicesRes.json();

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
            phone: doctor.phone ?? undefined,
            email: doctor.email ?? undefined,
            clinicIds: doctor.clinics?.map((c) => c.id) || [],
            serviceIds: doctor.services?.map((s) => s.id) || [],
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
