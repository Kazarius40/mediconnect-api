import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../users/user-role.enum';
import { UpdateUserRoleSwagger } from '../../swagger/methods/auth/dto/update-user-role.dto.swagger';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  @IsNotEmpty()
  @UpdateUserRoleSwagger()
  role: UserRole;
}
