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
import { TransformNormalizePhone } from '../../shared/utils/phone/normalize-phone.util';

export class AuthRegisterDto {
  @RegisterEmailSwagger()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @RegisterPasswordSwagger()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsStrongPassword()
  @IsString()
  password: string;

  @RegisterFirstNameSwagger()
  @IsOptional()
  @MaxLength(50)
  @IsValidName()
  @IsString()
  firstName?: string;

  @RegisterLastNameSwagger()
  @IsOptional()
  @MaxLength(50)
  @IsValidName()
  @IsString()
  lastName?: string;

  @RegisterPhoneSwagger()
  @IsOptional()
  @TransformNormalizePhone()
  @IsValidPhone()
  @IsString()
  phone?: string;
}
