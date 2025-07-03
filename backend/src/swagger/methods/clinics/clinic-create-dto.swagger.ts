import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export function ClinicNameSwagger() {
  return ApiProperty({
    description: "Clinic's name",
    example: 'Healthy Paws Clinic',
  });
}

export function ClinicAddressSwagger() {
  return ApiProperty({
    description: "Clinic's address",
    example: '123 Main St, Anytown',
  });
}

export function ClinicPhoneSwagger() {
  return ApiProperty({
    description: "Clinic's phone number",
    example: '+380671234567',
  });
}

export function ClinicEmailSwagger() {
  return ApiPropertyOptional({
    description: "Clinic's email address",
    example: 'info@clinic.com',
  });
}

export function ClinicDoctorsSwagger() {
  return ApiPropertyOptional({
    description: 'Array of doctor IDs associated with the clinic',
    example: [1, 2, 3],
    type: [Number],
  });
}
