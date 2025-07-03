import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export function ServiceNameSwagger() {
  return ApiProperty({
    description: 'The unique name of the service',
    example: 'Dental Cleaning',
  });
}

export function ServiceDescriptionSwagger() {
  return ApiPropertyOptional({
    description: 'An optional description of the service',
    example: 'A thorough cleaning of teeth and gums',
  });
}
