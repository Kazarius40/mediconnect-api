import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  ForgotPasswordMessageResponse,
  ResetPasswordMessageResponse,
} from '../../../responses/auth-response.swagger';

export function ForgotPasswordDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Send password reset link to email' }),
    ApiResponse({
      status: HttpStatus.OK,
      description:
        'If a user with that email exists, a password reset link has been sent.',
      type: ForgotPasswordMessageResponse,
    }),
  );
}

export function ResetPasswordDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Reset password using reset token' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Password has been successfully reset',
      type: ResetPasswordMessageResponse,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid or expired password reset token',
    }),
  );
}
