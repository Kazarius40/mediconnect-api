import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  UserResponse,
  UserRoleUpdateResponse,
} from '../../../responses/auth-response.swagger';
import { MessageResponse } from '../../../responses/common-responses.swagger';

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
