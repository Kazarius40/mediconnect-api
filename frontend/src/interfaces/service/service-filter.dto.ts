export interface ServiceFilterDto {
  name?: string;
  doctorIds?: number[];
  clinicIds?: number[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
