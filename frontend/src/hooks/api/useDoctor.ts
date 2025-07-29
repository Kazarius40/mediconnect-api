import { Doctor } from '@/interfaces/doctor';
import { useEntity } from './useEntity';

export function useDoctor(id: number, initialData: Doctor) {
  return useEntity<Doctor>(`/api/public/doctors/${id}`, initialData);
}
