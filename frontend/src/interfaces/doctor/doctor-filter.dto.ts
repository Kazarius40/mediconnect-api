export interface DoctorFilterDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  clinicIds?: number[];
  serviceIds?: number[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
