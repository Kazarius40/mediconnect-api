export interface CreateServiceDto {
  name: string;
  description?: string | null;
  doctorIds?: number[];
}

export type UpdateServiceDto = Partial<CreateServiceDto>;
