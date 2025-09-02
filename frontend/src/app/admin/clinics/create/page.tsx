'use server';

import { EntityHeader } from '@/components/common/entity-header';
import Form from '@/components/clinic/Form';
import { FRONTEND_URL } from '@/config/frontend';
import { DoctorShort } from '@/interfaces/doctor';

export default async function ClinicCreate() {
  try {
    const doctorsRes = await fetch(`${FRONTEND_URL}/api/doctors`, {
      cache: 'no-store',
    });

    if (!doctorsRes.ok) {
      console.error('Failed to fetch doctors', await doctorsRes.text());
      return <p className="error-message">Failed to load doctors</p>;
    }

    const { doctors }: { doctors: DoctorShort[] } = await doctorsRes.json();

    return (
      <>
        <EntityHeader
          title="Create Clinic"
          editPath=""
          backText="Back to Clinics"
          showControls={false}
        />

        <Form allDoctors={doctors} />
      </>
    );
  } catch (error) {
    return <p>Failed to load clinic</p>;
  }
}
