import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export function ServiceIdSwagger() {
  return ApiProperty({
    description: 'Unique identifier of the service',
    example: 1,
  });
}

export function ServiceNameSwagger() {
  return ApiProperty({
    description: 'Unique name of the service',
    example: 'Teeth Whitening',
  });
}

export function ServiceDescriptionSwagger() {
  return ApiPropertyOptional({
    description: 'Optional description of the service',
    example: 'A procedure for whitening teeth up to 8 shades',
  });
}

export function ServiceCreatedAtSwagger() {
  return ApiProperty({
    description: 'Date and time when the service was created',
    example: '2024-06-30T12:00:00Z',
  });
}

export function ServiceUpdatedAtSwagger() {
  return ApiProperty({
    description: 'Date and time when the service was last updated',
    example: '2024-07-01T15:30:00Z',
  });
}
