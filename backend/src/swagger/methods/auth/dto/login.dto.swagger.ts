import { ApiProperty } from '@nestjs/swagger';

export function LoginEmailSwagger() {
  return ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  });
}

export function LoginPasswordSwagger() {
  return ApiProperty({
    description: 'User password',
    example: 'Password123!',
  });
}
