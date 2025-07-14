import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export function ClinicNameSwagger() {
  return ApiProperty({
    description: "ClinicInterface's name",
    example: 'Healthy Paws ClinicInterface',
  });
}

export function ClinicAddressSwagger() {
  return ApiProperty({
    description: "ClinicInterface's address",
    example: '123 Main St, Anytown',
  });
}

export function ClinicPhoneSwagger() {
  return ApiProperty({
    description: "ClinicInterface's phone number",
    example: '+380671234567',
  });
}

export function ClinicEmailSwagger() {
  return ApiPropertyOptional({
    description: "ClinicInterface's email address",
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
