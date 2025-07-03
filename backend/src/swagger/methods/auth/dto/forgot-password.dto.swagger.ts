import { ApiProperty } from '@nestjs/swagger';

export function ForgotPasswordEmailSwagger() {
  return ApiProperty({
    description: 'Email address of the user who forgot the password',
    example: 'user@example.com',
  });
}
