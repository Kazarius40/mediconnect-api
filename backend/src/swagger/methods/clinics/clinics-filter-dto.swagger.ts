import { ApiPropertyOptional } from '@nestjs/swagger';

export function ClinicNameSwagger() {
  return ApiPropertyOptional({ description: 'Filter by clinic name' });
}

export function ClinicAddressSwagger() {
  return ApiPropertyOptional({ description: 'Filter by clinic address' });
}

export function ClinicPhoneSwagger() {
  return ApiPropertyOptional({ description: 'Filter by clinic phone number' });
}

export function ClinicEmailSwagger() {
  return ApiPropertyOptional({ description: 'Filter by clinic email' });
}

export function ClinicSortBySwagger(fields: string[]) {
  return ApiPropertyOptional({
    description: 'Field to sort by',
    enum: fields,
  });
}

export function ClinicSortOrderSwagger() {
  return ApiPropertyOptional({
    description: 'Sort order ("ASC" or "DESC")',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  });
}

export function ClinicDoctorIdsSwagger() {
  return ApiPropertyOptional({
    description: 'Filter by doctor IDs',
    type: [Number],
    example: [1, 2, 3],
  });
}

export function ClinicServiceIdsSwagger() {
  return ApiPropertyOptional({
    description:
      'Filter by service IDs (second-level relation via doctors.services)',
    type: [Number],
    example: [10, 20, 30],
  });
}
