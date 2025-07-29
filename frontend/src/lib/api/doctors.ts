import { Doctor } from '@/interfaces/doctor';
import { fetchPublic } from '@/lib/apiClient';

export async function getDoctors(): Promise<Doctor[]> {
  return fetchPublic('/doctors');
}

export async function getDoctorById(id: number): Promise<Doctor> {
  return fetchPublic(`/doctors/${id}`);
}
