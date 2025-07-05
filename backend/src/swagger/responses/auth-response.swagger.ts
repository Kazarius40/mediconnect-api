import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../shared/enums/user-role.enum';
import { MessageResponse } from './common-responses.swagger';

export class TokensResponse {
  @ApiProperty({
    description: 'Access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}

export class UserProfileResponse {
  @ApiProperty({ example: 1, description: 'Unique user identifier' })
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: UserRole.PATIENT,
    enum: UserRole,
    description: 'User role',
  })
  role: UserRole;

  @ApiProperty({
    example: 'Ivan',
    description: 'User first name (optional)',
    nullable: true,
  })
  firstName?: string;

  @ApiProperty({
    example: 'Petrov',
    description: 'User last name (optional)',
    nullable: true,
  })
  lastName?: string;

  @ApiProperty({
    example: '+380501234567',
    description: 'Phone number (optional)',
    nullable: true,
  })
  phone?: string;

  @ApiProperty({
    example: '2023-01-01T12:00:00.000Z',
    description: 'User creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T12:00:00.000Z',
    description: 'User last update date',
  })
  updatedAt: Date;

  @ApiProperty({
    example: 'some-unique-jwt-id',
    description: 'Unique identifier for the current JWT session (JTI)',
  })
  jti: string;
}

export class LogoutMessageResponse extends MessageResponse {
  @ApiProperty({
    example: 'Logged out successfully',
    description: 'Logout confirmation message',
  })
  declare message: string;
}

export class ForgotPasswordMessageResponse extends MessageResponse {
  @ApiProperty({
    example:
      'If a user with that email exists, a password reset link has been sent.',
    description: 'Password reset link sent confirmation message',
  })
  declare message: string;
}

export class ResetPasswordMessageResponse extends MessageResponse {
  @ApiProperty({
    example: 'Password has been successfully reset.',
    description: 'Password reset confirmation message',
  })
  declare message: string;
}

export class UserResponse {
  @ApiProperty({ example: 1, description: 'Unique user identifier' })
  id: number;

  @ApiProperty({
    example: 'test@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: UserRole.PATIENT,
    enum: UserRole,
    description: 'User role',
  })
  role: UserRole;

  @ApiProperty({
    example: 'Ivan',
    description: 'User first name (optional)',
    nullable: true,
  })
  firstName?: string;

  @ApiProperty({
    example: 'Petrov',
    description: 'User last name (optional)',
    nullable: true,
  })
  lastName?: string;

  @ApiProperty({
    example: '+380501234567',
    description: 'Phone number (optional)',
    nullable: true,
  })
  phone?: string;

  @ApiProperty({
    example: '2023-01-01T12:00:00.000Z',
    description: 'User creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T12:00:00.000Z',
    description: 'User last update date',
  })
  updatedAt: Date;
}

export class UserRoleUpdateResponse extends UserResponse {
  @ApiProperty({
    example: UserRole.DOCTOR,
    enum: UserRole,
    description: 'User role after update',
  })
  declare role: UserRole;
}
