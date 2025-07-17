import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import * as crypto from 'crypto';

import { User } from '../entities/user.entity';
import { AuthTokenService } from './auth-token.service';
import { AuthRegisterDto } from '../dto/auth-register.dto';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { AuthForgotPasswordDto } from '../dto/auth-forgot-password.dto';
import { AuthResetPasswordDto } from '../dto/auth-reset-password.dto';
import { Response as ExpressResponse } from 'express';
import { UserRole } from 'src/shared/enums/user-role.enum';
import { SafeUser } from '../interfaces/safe-user.interface';
import { validateEntityUniqueness } from '../../shared/validators/validate-entity-uniqueness.util';
import { handleDb } from '../../shared/utils/db/handle-db.util';
import { RequestWithCookies } from '../../shared/request-with-cookies.interface';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class AuthSessionService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: AuthTokenService,
    private readonly mailService: MailService,
  ) {}

  // -------------------
  // Registration & Authentication
  // -------------------
  async register(dto: AuthRegisterDto): Promise<SafeUser> {
    await validateEntityUniqueness(this.userRepository, dto);

    const user = this.userRepository.create({
      ...dto,
      role: UserRole.PATIENT,
    });

    await handleDb(() => this.userRepository.save(user));
    return this.toSafeUser(user);
  }

  async login(
    dto: AuthLoginDto,
    res: ExpressResponse,
  ): Promise<{ accessToken: string }> {
    const user = await this.validateUser(dto.email, dto.password);
    const { accessToken, refreshToken } =
      await this.tokenService.generateAndSaveTokens(user);

    this.tokenService.setRefreshCookie(res, refreshToken);
    return { accessToken };
  }

  /**
   * Log out by blocking refresh token
   */
  async logOut(
    cookies: Partial<Record<'refreshToken', string>>,
    res: ExpressResponse,
  ): Promise<{ message: string }> {
    const refreshToken = cookies?.refreshToken;

    if (!refreshToken) {
      throw new BadRequestException('Refresh token not found in cookies');
    }

    await this.tokenService.logOut(refreshToken);
    this.tokenService.clearAuthCookies(res);

    return { message: 'Logged out successfully' };
  }

  async refresh(
    req: RequestWithCookies,
    res: ExpressResponse,
  ): Promise<{ accessToken: string }> {
    const { accessToken } = await this.tokenService.refresh(req, res);

    return { accessToken };
  }

  // -------------------
  // Password management
  // -------------------
  async forgotPassword(
    dto: AuthForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = dto;
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return {
        message:
          'If a user with that email exists, a password reset link has been sent.',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;

    await handleDb(() => this.userRepository.save(user));

    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    await this.mailService.sendPasswordResetEmail(user.email, resetLink);

    return {
      message:
        'If a user with that email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(dto: AuthResetPasswordDto): Promise<{ message: string }> {
    const { token, password } = dto;

    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.tokenService.invalidateUserTokens(user.id);
    await handleDb(() => this.userRepository.save(user));

    return { message: 'Password has been successfully reset.' };
  }

  // -------------------
  // Helpers
  // -------------------
  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  private toSafeUser(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
