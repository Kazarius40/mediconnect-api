import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  LogoutMessageResponse,
  TokensResponse,
  UserResponse,
} from '../../../responses/auth-response.swagger';

export function RegisterDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new user' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User successfully registered',
      type: UserResponse,
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Email already in use',
    }),
  );
}

export function LoginDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'User login' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Successful login, returns access and refresh tokens',
      type: TokensResponse,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid credentials',
    }),
  );
}

export function RefreshDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Token refresh (refresh token sent via HttpOnly cookie)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Tokens successfully refreshed',
      type: TokensResponse,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid or expired refresh token',
    }),
  );
}

export function LogoutDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Account logout' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Logout successful',
      type: LogoutMessageResponse,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access',
    }),
  );
}
