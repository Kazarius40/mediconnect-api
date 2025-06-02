import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user who forgot the password',
    example: 'user@example.com',
  })
  email: string;
}
