import { ApiProperty } from '@nestjs/swagger';

export function ResetPasswordTokenSwagger() {
  return ApiProperty({
    description: 'Token received for password reset (e.g., from email link)',
    example: 'someLongAndSecureResetToken12345',
  });
}

export function ResetPasswordPasswordSwagger() {
  return ApiProperty({
    description:
      'New password for the user. Must be at least 6 characters long and contain at least one uppercase letter and one number.',
    example: 'NewPassword123!',
  });
}
