export interface ClinicFilterDto {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  doctorIds?: number[];
  serviceIds?: number[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
