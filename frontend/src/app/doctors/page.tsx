import DoctorsPageClient from '@/components/doctors/DoctorsPageClient';
import { Doctor } from '@/interfaces/doctor';
import { getDoctors } from '@/lib/api/doctors';
import { redirect } from 'next/navigation';

export default async function DoctorsPage() {
  let doctors: Doctor[] = [];

  try {
    doctors = await getDoctors();
  } catch (e) {
    console.error('Failed to fetch doctors', e);
    redirect('/');
  }

  return <DoctorsPageClient doctors={doctors} />;
}
