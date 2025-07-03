import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export function DoctorIdSwagger() {
  return ApiProperty({
    description: 'Unique identifier of the doctor',
    example: 1,
  });
}

export function DoctorFirstNameSwagger() {
  return ApiProperty({
    description: 'First name of the doctor',
    example: 'Oleksandr',
  });
}

export function DoctorLastNameSwagger() {
  return ApiProperty({
    description: 'Last name of the doctor',
    example: 'Shevchenko',
  });
}

export function DoctorEmailSwagger() {
  return ApiPropertyOptional({
    description: 'Email address of the doctor',
    example: 'oleksandr.shevchenko@example.com',
  });
}

export function DoctorPhoneSwagger() {
  return ApiPropertyOptional({
    description: 'Phone number of the doctor',
    example: '+380679876543',
  });
}

export function DoctorCreatedAtSwagger() {
  return ApiProperty({
    description: 'Date and time when the doctor record was created',
    example: '2024-06-30T12:00:00Z',
  });
}

export function DoctorUpdatedAtSwagger() {
  return ApiProperty({
    description: 'Date and time when the doctor record was last updated',
    example: '2024-07-01T15:30:00Z',
  });
}
