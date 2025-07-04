import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  UserProfileResponse,
  UserResponse,
} from '../../../responses/auth-response.swagger';
import { UpdateProfileDto } from '../../../../auth/dto/update-profile.dto';

export function GetProfileDocs() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Get user profile data' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User profile data',
      type: UserProfileResponse,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access',
    }),
  );
}

export function UpdateProfileDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update current user profile' }),
    ApiBody({ type: UpdateProfileDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User profile updated successfully.',
      type: UserResponse,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid data provided.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error.',
    }),
  );
}
