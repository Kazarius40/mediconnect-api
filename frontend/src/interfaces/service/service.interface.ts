import { Doctor } from '@/interfaces/doctor';

export interface Service {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  doctors: Doctor[];
}

export type ServiceShort = Pick<Service, 'id' | 'name'>;
