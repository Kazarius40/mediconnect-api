import { ApiPropertyOptional } from '@nestjs/swagger';

export function DoctorFirstNameSwagger() {
  return ApiPropertyOptional({
    description: "Filter by doctor's first name",
  });
}

export function DoctorLastNameSwagger() {
  return ApiPropertyOptional({
    description: "Filter by doctor's last name",
  });
}

export function DoctorEmailSwagger() {
  return ApiPropertyOptional({
    description: "Filter by doctor's email",
  });
}

export function DoctorPhoneSwagger() {
  return ApiPropertyOptional({
    description: "Filter by doctor's phone number",
  });
}

export function DoctorClinicIdsSwagger() {
  return ApiPropertyOptional({
    description: 'Filter by clinic IDs',
    type: [Number],
    example: [1, 2],
  });
}

export function DoctorServiceIdsSwagger() {
  return ApiPropertyOptional({
    description: 'Filter by service IDs',
    type: [Number],
    example: [10, 11],
  });
}

export function DoctorSortBySwagger(fields: string[]) {
  return ApiPropertyOptional({
    description: 'Field to sort by',
    enum: fields,
  });
}

export function DoctorSortOrderSwagger() {
  return ApiPropertyOptional({
    description: 'Sort order ("ASC" or "DESC")',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  });
}
