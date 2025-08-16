'use server';

import { redirect } from 'next/navigation';
import DoctorComponent from '@/components/doctors/DoctorComponent';
import { FRONTEND_URL } from '@/config/frontend';

export default async function DoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const doctorId = Number((await params).id);

  if (!doctorId) redirect('/doctors');

  try {
    const res = await fetch(`${FRONTEND_URL}/api/doctors/${doctorId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      redirect('/doctors');
    }

    const { doctor } = await res.json();

    return <DoctorComponent doctor={doctor} />;
  } catch (error) {
    console.error('Error fetching doctor:', error);
    redirect('/doctors');
  }
}
