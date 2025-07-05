import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  UserResponse,
  UserRoleUpdateResponse,
} from '../../../responses/auth-response.swagger';
import { MessageResponse } from '../../../responses/common-responses.swagger';
import { AuthAdminUpdateUserDto } from '../../../../auth/dto/auth-admin-update-user.dto';

export function GetAllUsersDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a list of all users (Admin only)',
      description:
        'Returns all registered users without sensitive information.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'List of users successfully retrieved.',
      type: [UserResponse],
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access',
    }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied' }),
  );
}

export function GetUserByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user information by ID (Admin only)' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User information',
      type: UserResponse,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User with this ID not found',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access',
    }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied' }),
  );
}

export function AdminUpdateUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update user data by admin (partial/full update)',
    }),
    ApiBody({ type: AuthAdminUpdateUserDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User data updated successfully.',
      type: UserResponse,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid data provided.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Conflict with existing user data (email/phone).',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Access denied.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error.',
    }),
  );
}

export function UpdateUserRoleDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Change user role by ID (Admin only)' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User role updated successfully',
      type: UserRoleUpdateResponse,
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Admin cannot change own role to non-admin',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found',
    }),
  );
}

export function DeleteUserDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete user by ID (Admin only)' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User successfully deleted',
      type: MessageResponse,
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Admin cannot delete own account',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found',
    }),
  );
}
