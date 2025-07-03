import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../users/user-role.enum';

export function UpdateUserRoleSwagger() {
  return ApiProperty({
    example: UserRole.DOCTOR,
    enum: UserRole,
    description: 'The new role for the user',
  });
}
