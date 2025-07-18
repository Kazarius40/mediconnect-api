import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { Token } from '../../../auth/entities/token.entity';

export function UserIdSwagger() {
  return ApiProperty({ example: 1, description: 'User unique identifier' });
}

export function UserEmailSwagger() {
  return ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  });
}

export function UserPasswordSwagger() {
  return ApiProperty({
    example: 'strongPassword123',
    description: 'User password',
    writeOnly: true,
  });
}

export function UserRoleSwagger() {
  return ApiProperty({
    example: UserRole.PATIENT,
    description: 'User role',
    enum: UserRole,
  });
}

export function UserEmailVerifiedSwagger() {
  return ApiProperty({
    example: false,
    description: 'Indicates whether the user has verified their email',
  });
}

export function UserVerificationTokenSwagger() {
  return ApiProperty({
    example: 'verification-token-abc123',
    description: 'Email verification token (used to confirm email)',
    nullable: true,
  });
}

export function UserVerificationTokenExpiresSwagger() {
  return ApiProperty({
    example: '2025-07-19T15:00:00Z',
    description: 'Expiration date for the email verification token',
    nullable: true,
  });
}

export function UserFirstNameSwagger() {
  return ApiProperty({
    example: 'Ivan',
    description: 'User first name',
    nullable: true,
  });
}

export function UserLastNameSwagger() {
  return ApiProperty({
    example: 'Petrov',
    description: 'User last name',
    nullable: true,
  });
}

export function UserPhoneSwagger() {
  return ApiProperty({
    example: '+380501234567',
    description: 'User phone number',
    nullable: true,
  });
}

export function UserResetPasswordTokenSwagger() {
  return ApiProperty({
    example: 'random-reset-token-123',
    description: 'Password reset token',
    nullable: true,
  });
}

export function UserResetPasswordExpiresSwagger() {
  return ApiProperty({
    example: '2025-07-10T15:00:00Z',
    description: 'Password reset token expiry date',
    nullable: true,
  });
}

export function UserCreatedAtSwagger() {
  return ApiProperty({
    example: '2025-07-01T12:34:56Z',
    description: 'User creation timestamp',
  });
}

export function UserUpdatedAtSwagger() {
  return ApiProperty({
    example: '2025-07-02T12:34:56Z',
    description: 'User last update timestamp',
  });
}

export function UserTokensSwagger() {
  return ApiProperty({
    type: () => [Token],
    description: 'Tokens associated with the user',
  });
}
