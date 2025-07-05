import { IsNotEmpty, IsString } from 'class-validator';
import {
  ResetPasswordPasswordSwagger,
  ResetPasswordTokenSwagger,
} from '../../swagger/methods/auth/dto/reset-password.dto.swagger';
import { IsStrongPassword } from '../../shared/validators/custom-validators';

export class AuthResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ResetPasswordTokenSwagger()
  token: string;

  @IsString()
  @IsStrongPassword()
  @ResetPasswordPasswordSwagger()
  password: string;
}
