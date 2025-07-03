import { ApiPropertyOptional } from '@nestjs/swagger';

export function ServiceNameSwagger() {
  return ApiPropertyOptional({ description: 'Filter by service name' });
}

export function ServiceSortBySwagger(fields: string[]) {
  return ApiPropertyOptional({
    description: 'Field for sorting',
    enum: fields,
  });
}

export function ServiceSortOrderSwagger() {
  return ApiPropertyOptional({
    description: 'Sort order ("ASC" or "DESC")',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  });
}

export function ServiceDoctorIdsSwagger() {
  return ApiPropertyOptional({
    description: 'Filter by doctor IDs',
    type: [Number],
    example: [1, 2, 3],
  });
}

export function ServiceClinicIdsSwagger() {
  return ApiPropertyOptional({
    description:
      'Filter by clinic IDs (second-level relation via doctors.clinics)',
    type: [Number],
    example: [100, 200, 300],
  });
}
