import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthRegisterDto } from '../dto/auth-register.dto';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { AuthRefreshTokenDto } from '../dto/auth-refresh-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRequest } from '../interfaces/user-request.interface';
import { AuthAdminService } from '../services/auth-admin.service';
import { AuthTokenService } from '../services/auth-token.service';
import {
  LoginDocs,
  LogoutDocs,
  RefreshDocs,
  RegisterDocs,
} from '../../swagger/methods/auth/auth/auth-public-docs.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthSessionController {
  constructor(
    private readonly authAdminService: AuthAdminService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @RegisterDocs()
  async register(@Body() dto: AuthRegisterDto) {
    return await this.authAdminService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginDocs()
  async login(@Body() dto: AuthLoginDto) {
    return await this.authAdminService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @RefreshDocs()
  async refresh(
    @Request() _req: UserRequest,
    @Body() dto: AuthRefreshTokenDto,
  ) {
    return await this.authTokenService.refresh(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @LogoutDocs()
  async logOut(@Request() _req: UserRequest, @Body() dto: AuthRefreshTokenDto) {
    await this.authTokenService.logOut(dto.refreshToken);
    return { message: 'Logged out successfully' };
  }
}
