import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Token received for password reset (e.g., from email link)',
    example: 'someLongAndSecureResetToken12345',
  })
  token: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d).{6,}$/, {
    message:
      'Password must contain at least one uppercase letter and one number',
  })
  @ApiProperty({
    description:
      'New password for the user. Must be at least 6 characters long and contain at least one uppercase letter and one number.',
    example: 'NewPassword123',
  })
  password: string;
}
