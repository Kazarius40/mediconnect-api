export interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  doctors?: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    services?: {
      id: number;
      name: string;
      description?: string;
    }[];
  }[];
}
