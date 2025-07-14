import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export function ClinicIdSwagger() {
  return ApiProperty({
    description: 'Unique identifier of the clinic',
    example: 1,
  });
}

export function ClinicNameSwagger() {
  return ApiProperty({
    description: 'Name of the clinic',
    example: 'Healthy Paws ClinicInterface',
  });
}

export function ClinicAddressSwagger() {
  return ApiProperty({
    description: 'Address of the clinic',
    example: '123 Main St, Anytown',
  });
}

export function ClinicPhoneSwagger() {
  return ApiProperty({
    description: 'Phone number of the clinic',
    example: '+380671234567',
  });
}

export function ClinicEmailSwagger() {
  return ApiPropertyOptional({
    description: 'Email address of the clinic',
    example: 'info@clinic.com',
  });
}

export function ClinicCreatedAtSwagger() {
  return ApiProperty({
    description: 'Date and time when the clinic record was created',
    example: '2024-06-30T12:00:00Z',
  });
}

export function ClinicUpdatedAtSwagger() {
  return ApiProperty({
    description: 'Date and time when the clinic record was last updated',
    example: '2024-07-01T15:30:00Z',
  });
}
