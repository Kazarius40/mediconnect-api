export interface CreateDoctorDto {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  clinicIds?: number[];
  serviceIds?: number[];
}

export type UpdateDoctorDto = Partial<CreateDoctorDto>;
