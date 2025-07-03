import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../users/user-role.enum';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
import { UserRequest } from '../interfaces/user-request.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import {
  DeleteUserDocs,
  GetAllUsersDocs,
  GetUserByIdDocs,
  UpdateUserRoleDocs,
} from '../../swagger/methods/auth/auth/auth-admin-docs.swagger';

@ApiTags('Auth')
@Controller('auth/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllUsersDocs()
  async getAllUsers() {
    return await this.authService.findAllUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetUserByIdDocs()
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.authService.findUserByIdOrFail(id);
  }

  @Patch(':id/role')
  @HttpCode(HttpStatus.OK)
  @UpdateUserRoleDocs()
  async updateUserRole(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return await this.authService.updateUserRole(id, dto.role, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteUserDocs()
  async deleteUser(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.authService.deleteUser(id, req.user.id);
  }
}
