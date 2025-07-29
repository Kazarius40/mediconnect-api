import { Clinic } from '@/interfaces/clinic';
import { useEntity } from './useEntity';

export function useClinic(id: number, initialData: Clinic) {
  return useEntity<Clinic>(`/api/public/clinics/${id}`, initialData);
}
