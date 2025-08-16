import { Doctor } from '@/interfaces/doctor';

export interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
  doctors: Doctor[];
}

export type ClinicShort = Pick<Clinic, 'id' | 'name'>;
