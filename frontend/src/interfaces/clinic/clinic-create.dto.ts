export interface CreateClinicDto {
  name: string;
  address: string;
  phone: string;
  email: string | null;
  doctorIds?: number[];
}

export type UpdateClinicDto = Partial<CreateClinicDto>;
