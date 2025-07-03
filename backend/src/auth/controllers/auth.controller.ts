import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRequest } from '../interfaces/user-request.interface';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import {
  LoginDocs,
  LogoutDocs,
  RefreshDocs,
  RegisterDocs,
} from '../../swagger/methods/auth/auth/auth-public-docs.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @RegisterDocs()
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginDocs()
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @RefreshDocs()
  async refresh(@Request() _req: UserRequest, @Body() dto: RefreshTokenDto) {
    return await this.tokenService.refresh(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @LogoutDocs()
  async logOut(@Request() _req: UserRequest, @Body() dto: RefreshTokenDto) {
    await this.tokenService.logOut(dto.refreshToken);
    return { message: 'Logged out successfully' };
  }
}
