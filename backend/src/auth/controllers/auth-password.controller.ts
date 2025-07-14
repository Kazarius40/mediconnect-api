import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthForgotPasswordDto } from '../dto/auth-forgot-password.dto';
import { AuthResetPasswordDto } from '../dto/auth-reset-password.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  ForgotPasswordDocs,
  ResetPasswordDocs,
} from '../../swagger/methods/auth/auth/auth-password-docs.swagger';
import { AuthSessionService } from '../services/auth-session.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthPasswordController {
  constructor(private readonly sessionService: AuthSessionService) {}

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ForgotPasswordDocs()
  async forgotPassword(@Body() dto: AuthForgotPasswordDto) {
    return await this.sessionService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ResetPasswordDocs()
  async resetPassword(@Body() dto: AuthResetPasswordDto) {
    return await this.sessionService.resetPassword(dto);
  }
}
