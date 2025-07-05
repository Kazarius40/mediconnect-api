import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../shared/enums/user-role.enum';
import { UpdateUserRoleSwagger } from '../../swagger/methods/auth/dto/update-user-role.dto.swagger';

export class AuthUpdateUserRoleDto {
  @IsEnum(UserRole)
  @IsNotEmpty()
  @UpdateUserRoleSwagger()
  role: UserRole;
}
