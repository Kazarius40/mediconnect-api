import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  IsValidName,
  IsValidPhone,
} from '../../shared/validators/custom-validators';
import { TransformNormalizePhone } from '../../shared/utils/phone/normalize-phone.util';

export class AuthAdminUpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @IsValidName()
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @IsValidName()
  lastName?: string;

  @IsOptional()
  @IsString()
  @IsValidPhone()
  @TransformNormalizePhone()
  phone?: string;
}
