export interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'PATIENT' | 'DOCTOR';
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}
