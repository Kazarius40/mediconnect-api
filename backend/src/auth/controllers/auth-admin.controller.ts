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
import { UserRole } from '../../shared/enums/user-role.enum';
import { AuthUpdateUserRoleDto } from '../dto/auth-update-user-role.dto';
import { UserRequest } from '../interfaces/user-request.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthAdminService } from '../services/auth-admin.service';
import {
  AdminUpdateUserDocs,
  DeleteUserDocs,
  GetAllUsersDocs,
  GetUserByIdDocs,
  UpdateUserRoleDocs,
} from '../../swagger/methods/auth/auth/auth-admin-docs.swagger';
import { AuthAdminUpdateUserDto } from '../dto/auth-admin-update-user.dto';

@Controller('auth/users')
@ApiTags('Auth')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AuthAdminController {
  constructor(private readonly authAdminService: AuthAdminService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllUsersDocs()
  async getAllUsers() {
    return await this.authAdminService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetUserByIdDocs()
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.authAdminService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AdminUpdateUserDocs()
  async adminUpdateUser(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: AuthAdminUpdateUserDto,
  ) {
    return await this.authAdminService.update(userId, dto, req.user.id);
  }

  @Patch(':id/role')
  @HttpCode(HttpStatus.OK)
  @UpdateUserRoleDocs()
  async updateUserRole(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AuthUpdateUserRoleDto,
  ) {
    return await this.authAdminService.update(
      id,
      { role: dto.role },
      req.user.id,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteUserDocs()
  async deleteUser(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.authAdminService.delete(id, req.user.id);
  }
}
