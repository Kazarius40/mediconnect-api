import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthForgotPasswordDto } from '../dto/auth-forgot-password.dto';
import { AuthResetPasswordDto } from '../dto/auth-reset-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthAdminService } from '../services/auth-admin.service';
import {
  ForgotPasswordDocs,
  ResetPasswordDocs,
} from '../../swagger/methods/auth/auth/auth-password-docs.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthPasswordController {
  constructor(private readonly authAdminService: AuthAdminService) {}

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ForgotPasswordDocs()
  async forgotPassword(@Body() dto: AuthForgotPasswordDto) {
    return await this.authAdminService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ResetPasswordDocs()
  async resetPassword(@Body() dto: AuthResetPasswordDto) {
    return await this.authAdminService.resetPassword(dto);
  }
}
