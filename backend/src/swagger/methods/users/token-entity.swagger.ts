import { ApiProperty } from '@nestjs/swagger';

export function TokenIdSwagger() {
  return ApiProperty({ example: 1, description: 'Token unique identifier' });
}

export function TokenAccessTokenSwagger() {
  return ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  });
}

export function TokenRefreshTokenSwagger() {
  return ApiProperty({
    example: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4=',
    description: 'JWT refresh token',
  });
}

export function TokenAccessTokenExpiresAtSwagger() {
  return ApiProperty({
    example: '2025-07-10T15:00:00Z',
    description: 'Access token expiration date',
  });
}

export function TokenRefreshTokenExpiresAtSwagger() {
  return ApiProperty({
    example: '2025-07-17T15:00:00Z',
    description: 'Refresh token expiration date',
  });
}

export function TokenIsBlockedSwagger() {
  return ApiProperty({
    example: false,
    description: 'Indicates if the token is blocked',
  });
}

export function TokenJtiSwagger() {
  return ApiProperty({
    example: 'unique-jti-string',
    description: 'JWT ID (jti) claim',
  });
}
