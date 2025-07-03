import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  RegisterEmailSwagger,
  RegisterFirstNameSwagger,
  RegisterLastNameSwagger,
  RegisterPasswordSwagger,
  RegisterPhoneSwagger,
} from '../../swagger/methods/auth/dto/register.dto.swagger';
import {
  IsStrongPassword,
  IsValidName,
  IsValidPhone,
} from '../../shared/validators/custom-validators';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @RegisterEmailSwagger()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsStrongPassword()
  @RegisterPasswordSwagger()
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @IsValidName()
  @RegisterFirstNameSwagger()
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @IsValidName()
  @RegisterLastNameSwagger()
  lastName?: string;

  @IsOptional()
  @IsString()
  @IsValidPhone()
  @RegisterPhoneSwagger()
  phone?: string;
}
