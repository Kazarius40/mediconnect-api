import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export function DoctorFirstNameSwagger() {
  return ApiProperty({
    description: "ClinicInterface's first name",
    example: 'Oleksandr',
  });
}

export function DoctorLastNameSwagger() {
  return ApiProperty({
    description: "ClinicInterface's last name",
    example: 'Shevchenko',
  });
}

export function DoctorEmailSwagger() {
  return ApiPropertyOptional({
    description: "ClinicInterface's email address",
    example: 'oleksandr.shevchenko@example.com',
  });
}

export function DoctorPhoneSwagger() {
  return ApiPropertyOptional({
    description: "ClinicInterface's phone number",
    example: '+380679876543',
  });
}

export function DoctorClinicsSwagger() {
  return ApiPropertyOptional({
    description: 'Array of clinic IDs the doctor is associated with',
    example: [1, 2],
    type: [Number],
  });
}

export function DoctorServicesSwagger() {
  return ApiPropertyOptional({
    description: 'Array of service IDs the doctor provides',
    example: [10, 11],
    type: [Number],
  });
}
