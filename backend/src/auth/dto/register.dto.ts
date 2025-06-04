import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).{6,}$/, {
    message:
      'Password must contain at least one uppercase letter and one number',
  })
  password: string;

  @ApiProperty({
    example: 'Ivan',
    description: 'User first name (optional)',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Za-zА-Яа-яЇїІіЄєҐґ\s-]*$/, {
    message: 'First name must contain only letters, spaces, and hyphens',
  })
  firstName?: string;

  @ApiProperty({
    example: 'Petrov',
    description: 'User last name (optional)',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Za-zА-Яа-яЇїІіЄєҐґ\s-]*$/, {
    message: 'Last name must contain only letters, spaces, and hyphens',
  })
  lastName?: string;

  @ApiProperty({
    example: '+380501234567',
    description: 'Phone number (optional)',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'Phone number must be valid',
  })
  phone?: string;
}
