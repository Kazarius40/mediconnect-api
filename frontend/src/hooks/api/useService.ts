import { Service } from '@/interfaces/service';
import { useEntity } from './useEntity';

export function useService(id: number, initialData: Service) {
  return useEntity<Service>(`/api/public/services/${id}`, initialData);
}
