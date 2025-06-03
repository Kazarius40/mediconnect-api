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
    description: 'Електронна пошта користувача',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Пароль користувача' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).{6,}$/, {
    message:
      'Password must contain at least one uppercase letter and one number',
  })
  password: string;

  @ApiProperty({
    example: 'Іван',
    description: 'Ім`я користувача (необов`язково)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Za-zА-Яа-яЇїІіЄєҐґ\s-]*$/, {
    message: 'First name must contain only letters, spaces, and hyphens',
  })
  firstName?: string;

  @ApiProperty({
    example: 'Іван',
    description: 'Прізвище користувача (необов`язково)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Za-zА-Яа-яЇїІіЄєҐґ\s-]*$/, {
    message: 'First name must contain only letters, spaces, and hyphens',
  })
  lastName?: string;

  @ApiProperty({
    example: '+380501234567',
    description: 'Номер телефону (необов`язково)',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'Phone number must be valid',
  })
  phone?: string;

  // @ApiProperty({
  //   example: UserRole.PATIENT,
  //   enum: UserRole,
  //   description:
  //     'Роль користувача (ADMIN, DOCTOR, PATIENT). За замовчуванням PATIENT.',
  // })
  // @IsOptional()
  // @IsEnum(UserRole, {
  //   message: `role must be one of the following values: ${Object.values(UserRole).join(', ')}`,
  // })
  // role?: UserRole;
}
