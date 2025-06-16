import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ForgotPasswordMessageResponse,
  ResetPasswordMessageResponse,
} from '../swagger/auth-response.swagger';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class PasswordController {
  constructor(private readonly authService: AuthService) {}

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send password reset link to email',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'If a user with that email exists, a password reset link has been sent.',
    type: ForgotPasswordMessageResponse,
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return {
      message:
        'If a user with that email exists, a password reset link has been sent.',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using reset token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password has been successfully reset',
    type: ResetPasswordMessageResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid or expired password reset token',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: 'Password has been successfully reset.' };
  }
}
