import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export function RegisterEmailSwagger() {
  return ApiProperty({
    example: 'test@example.com',
    description: 'User email address',
  });
}

export function RegisterPasswordSwagger() {
  return ApiProperty({
    example: 'Password123!',
    description: 'User password',
  });
}

export function RegisterFirstNameSwagger() {
  return ApiPropertyOptional({
    example: 'Ivan',
    description: 'User first name (optional)',
    nullable: true,
  });
}

export function RegisterLastNameSwagger() {
  return ApiPropertyOptional({
    example: 'Petrov',
    description: 'User last name (optional)',
    nullable: true,
  });
}

export function RegisterPhoneSwagger() {
  return ApiPropertyOptional({
    example: '+380501234567',
    description: 'Phone number (optional)',
    nullable: true,
  });
}
