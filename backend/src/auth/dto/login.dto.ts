import { IsEmail, IsString, MinLength } from 'class-validator';
import {
  LoginEmailSwagger,
  LoginPasswordSwagger,
} from '../../swagger/methods/auth/dto/login.dto.swagger';

export class LoginDto {
  @IsEmail()
  @LoginEmailSwagger()
  email: string;

  @IsString()
  @MinLength(6)
  @LoginPasswordSwagger()
  password: string;
}
