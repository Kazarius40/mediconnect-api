import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../users/user-role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    example: UserRole.DOCTOR,
    enum: UserRole,
    description: 'The new role for the user',
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
