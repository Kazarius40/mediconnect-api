import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { UserRole } from '../../users/user-role.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d).{6,}$/, {
    message:
      'Password must contain at least one uppercase letter and one number',
  })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[a-zA-Z]+$/, {
    message: 'First name must contain only letters',
  })
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Last name must contain only letters',
  })
  lastName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'Phone number must be valid',
  })
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
