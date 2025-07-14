import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthRegisterDto } from '../dto/auth-register.dto';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  LoginDocs,
  LogoutDocs,
  RefreshDocs,
  RegisterDocs,
} from '../../swagger/methods/auth/auth/auth-public-docs.swagger';
import { AuthSessionService } from '../services/auth-session.service';
import { Request, Response } from 'express';

type RequestWithCookies = Request & { cookies: Record<string, string> };

@ApiTags('Auth')
@Controller('auth')
export class AuthSessionController {
  constructor(private readonly sessionService: AuthSessionService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @RegisterDocs()
  async register(@Body() dto: AuthRegisterDto) {
    return await this.sessionService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginDocs()
  async login(
    @Body() dto: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sessionService.login(dto, res);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @RefreshDocs()
  async refresh(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sessionService.refresh(req, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @LogoutDocs()
  async logOut(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.sessionService.logOut(req.cookies, res);
  }
}
