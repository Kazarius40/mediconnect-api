import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from './interfaces/user-request.interface';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ProfileService } from './profile.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RolesGuard } from './guards/roles.guard';
import { UserRole } from '../users/user-role.enum';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Roles } from './decorators/roles.decorator';
import {
  TokensResponse,
  UserProfileResponse,
  LogoutMessageResponse,
  ForgotPasswordMessageResponse,
  ResetPasswordMessageResponse,
  UserResponse,
  UserRoleUpdateResponse,
} from './swagger/auth-response.swagger';
import { MessageResponse } from '../swagger/common-responses.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly profileService: ProfileService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    type: UserResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already in use',
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful login, returns access and refresh tokens',
    type: TokensResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({ summary: 'Token refresh' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tokens successfully refreshed',
    type: TokensResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired refresh token',
  })
  async refresh(
    @Request() req: UserRequest,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return await this.tokenService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Account logout' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout successful',
    type: LogoutMessageResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async logOut(
    @Request() req: UserRequest,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    await this.tokenService.logOut(refreshTokenDto.refreshToken);
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user profile data' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile data',
    type: UserProfileResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  getProfile(@Request() req: UserRequest) {
    return this.profileService.getProfile(req.user);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send password reset link to email',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'If a user with that email exists, a password reset link has been sent.',
    type: ForgotPasswordMessageResponse,
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return {
      message:
        'If a user with that email exists, a password reset link has been sent.',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using reset token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password has been successfully reset',
    type: ResetPasswordMessageResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid or expired password reset token',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: 'Password has been successfully reset.' };
  }

  @Get('users/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
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

  @Patch('users/:id/role')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Change user role by ID (Admin only)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User role successfully updated',
    type: UserRoleUpdateResponse,
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
  async updateUserRole(
    @Request() req: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    if (req.user.id === id && updateUserRoleDto.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Admin cannot change their own role to a non-admin role.',
      );
    }
    return await this.authService.updateUserRole(id, updateUserRoleDto.role);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete a user by ID (Admin only)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully deleted',
    type: MessageResponse,
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
    description: 'Access denied (e.g., trying to delete own admin account)',
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
