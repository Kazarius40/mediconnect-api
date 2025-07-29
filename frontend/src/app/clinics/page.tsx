import ClinicsClientPage from '@/components/clinics/ClinicsClientPage';
import { getClinics } from '@/lib/api/clinics';
import { Clinic } from '@/interfaces/clinic';
import { redirect } from 'next/navigation';

export default async function ClinicsPage() {
  let clinics: Clinic[] = [];

  try {
    clinics = await getClinics();
  } catch (e) {
    console.error('Failed to fetch clinics', e);
    redirect('/');
  }

  return <ClinicsClientPage clinics={clinics} />;
}
