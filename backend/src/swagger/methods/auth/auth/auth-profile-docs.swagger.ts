import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserProfileResponse } from '../../../responses/auth-response.swagger';

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
