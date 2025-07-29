import { fetchPublic } from '@/lib/apiClient';
import { Clinic } from '@/interfaces/clinic';

export async function getClinics(): Promise<Clinic[]> {
  return fetchPublic('/clinics');
}

export async function getClinicById(id: number): Promise<Clinic> {
  return fetchPublic(`/clinics/${id}`);
}
