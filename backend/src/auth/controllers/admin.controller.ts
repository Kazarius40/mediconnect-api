import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  ForbiddenException,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../users/user-role.enum';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
import { UserRequest } from '../interfaces/user-request.interface';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserResponse,
  UserRoleUpdateResponse,
} from '../swagger/auth-response.swagger';
import { MessageResponse } from '../../swagger/common-responses.swagger';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @ApiOperation({
    summary: 'Get a list of all users (Admin only)',
    description: 'Returns all registered users without sensitive information.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users successfully retrieved.',
    type: [UserResponse],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied',
  })
  async getAllUsers() {
    return await this.authService.findAllUsers();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user information by ID (Admin only)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User information',
    type: UserResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User with this ID not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied',
  })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.authService['userRepository'].findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  @Patch(':id/role')
  @ApiOperation({
    summary: 'Change user role by ID (Admin only)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User role updated successfully',
    type: UserRoleUpdateResponse,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin cannot change own role to non-admin',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async updateUserRole(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
  ) {
    if (req.user.id === id && dto.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Admin cannot change their own role to a non-admin role.',
      );
    }
    return await this.authService.updateUserRole(id, dto.role);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete user by ID (Admin only)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully deleted',
    type: MessageResponse,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin cannot delete own account',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async deleteUser(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (req.user.id === id) {
      throw new ForbiddenException('Admin cannot delete their own account.');
    }
    await this.authService.deleteUser(id);
    return { message: `User with ID ${id} successfully deleted.` };
  }
}
