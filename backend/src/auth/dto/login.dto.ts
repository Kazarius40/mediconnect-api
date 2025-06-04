import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: 'User password', example: 'Password123!' })
  password: string;
}
