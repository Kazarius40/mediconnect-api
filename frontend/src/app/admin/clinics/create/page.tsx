'use server';

import './style.css';
import { EntityHeader } from '@/components/common/EntityHeader';
import ClinicForm from '@/components/clinics/ClinicForm';
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
      <div className="page-container">
        <EntityHeader
          title="Create Clinic"
          editPath=""
          backText="Back to Clinics"
          showControls={false}
        />

        <ClinicForm allDoctors={doctors} />
      </div>
    );
  } catch (error) {
    return <p className="error-message">Failed to load clinic</p>;
  }
}
