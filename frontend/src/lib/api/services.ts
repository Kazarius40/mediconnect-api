import { Service } from '@/interfaces/service';
import { fetchPublic } from '@/lib/apiClient';

export async function getServices(): Promise<Service[]> {
  return fetchPublic('/services');
}

export async function getServiceById(id: number): Promise<Service> {
  return fetchPublic(`/services/${id}`);
}
