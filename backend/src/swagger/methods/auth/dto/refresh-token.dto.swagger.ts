import { ApiProperty } from '@nestjs/swagger';

export function RefreshTokenSwagger() {
  return ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  });
}
