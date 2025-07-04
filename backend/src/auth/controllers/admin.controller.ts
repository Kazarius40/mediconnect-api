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
  AdminUpdateUserDocs,
  DeleteUserDocs,
  GetAllUsersDocs,
  GetUserByIdDocs,
  UpdateUserRoleDocs,
} from '../../swagger/methods/auth/auth/auth-admin-docs.swagger';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto';

@Controller('auth/users')
@ApiTags('Auth')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllUsersDocs()
  async getAllUsers() {
    return await this.authService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetUserByIdDocs()
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.authService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AdminUpdateUserDocs()
  async adminUpdateUser(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: AdminUpdateUserDto,
  ) {
    return await this.authService.update(userId, dto, req.user.id);
  }

  @Patch(':id/role')
  @HttpCode(HttpStatus.OK)
  @UpdateUserRoleDocs()
  async updateUserRole(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return await this.authService.update(id, { role: dto.role }, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteUserDocs()
  async deleteUser(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.authService.delete(id, req.user.id);
  }
}
