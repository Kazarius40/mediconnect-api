import { redirect } from 'next/navigation';
import { Doctor } from '@/interfaces/doctor';
import DoctorViewClient from '@/components/doctors/DoctorViewClient';
import { getDoctorById } from '@/lib/api/doctors';

export default async function DoctorViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const doctorId = Number(resolvedParams.id);

  if (!doctorId) redirect('/doctors');

  let doctor: Doctor | null = null;

  try {
    doctor = await getDoctorById(doctorId);
  } catch (e) {
    console.error('Failed to fetch doctor', e);
    redirect('/doctors');
  }

  return <DoctorViewClient doctor={doctor} />;
}
