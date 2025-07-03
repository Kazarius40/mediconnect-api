import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import {
  ForgotPasswordDocs,
  ResetPasswordDocs,
} from '../../swagger/methods/auth/auth/auth-password-docs.swagger';

@ApiTags('Auth')
@Controller('auth')
export class PasswordController {
  constructor(private readonly authService: AuthService) {}

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ForgotPasswordDocs()
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ResetPasswordDocs()
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto);
  }
}
