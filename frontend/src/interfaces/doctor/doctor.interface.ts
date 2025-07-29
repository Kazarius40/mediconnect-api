import { Clinic } from '@/interfaces/clinic';
import { Service } from '@/interfaces/service';

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
  clinics: Clinic[];
  services: Service[];
}
