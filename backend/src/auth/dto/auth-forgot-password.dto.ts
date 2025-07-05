import { IsEmail } from 'class-validator';
import { ForgotPasswordEmailSwagger } from '../../swagger/methods/auth/dto/forgot-password.dto.swagger';

export class AuthForgotPasswordDto {
  @IsEmail()
  @ForgotPasswordEmailSwagger()
  email: string;
}
