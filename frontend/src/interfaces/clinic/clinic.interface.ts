import { Doctor } from '@/interfaces/doctor';

export interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  doctors?: Doctor[];
}
