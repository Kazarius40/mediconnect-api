import {
  BadRequestException,
  ConflictException,
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
import { validateEntityUniqueness } from '../../shared/validators/validate-entity-uniqueness.util';
import { handleDb } from '../../shared/utils/db/handle-db.util';
import { RequestWithCookies } from '../../shared/interfaces/request-with-cookies.interface';
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
  async register(dto: AuthRegisterDto): Promise<{ message: string }> {
    try {
      await validateEntityUniqueness(this.userRepository, dto);
    } catch (e) {
      if (e instanceof ConflictException) {
        const existingUser = await this.userRepository.findOneBy({
          email: dto.email,
        });
        if (existingUser && !existingUser.emailVerified) {
          await this.generateAndSendVerification(existingUser);
        }

        return {
          message:
            'If the email is not registered, a verification email has been sent. Please check your inbox.',
        };
      }
      throw e;
    }

    const user = this.userRepository.create({
      ...dto,
      role: UserRole.PATIENT,
      emailVerified: false,
    });

    await this.generateAndSendVerification(user);

    return {
      message:
        'If the email is not registered, a verification email has been sent. Please check your inbox.',
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: {
        verificationToken: token,
        verificationTokenExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.emailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;

    await handleDb(() => this.userRepository.save(user));

    return { message: 'Email verified successfully! You can now log in.' };
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ email });

    if (user && !user.emailVerified) {
      await this.generateAndSendVerification(user);
    }

    return {
      message:
        'If an account with this email exists and is not yet verified, a new verification email has been sent.',
    };
  }

  async login(
    dto: AuthLoginDto,
    res: ExpressResponse,
  ): Promise<{ accessToken: string }> {
    const user = await this.validateUser(dto.email, dto.password);

    if (!user.emailVerified && user.verificationToken !== null) {
      throw new UnauthorizedException(
        'Please verify your email before logging in.',
      );
    }

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

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 3600000);

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpires;

      await handleDb(() => this.userRepository.save(user));

      const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

      await this.mailService.sendPasswordResetEmail(user.email, resetLink);
    }

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

  private async generateAndSendVerification(user: User): Promise<void> {
    user.verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await handleDb(() => this.userRepository.save(user));

    const verifyLink = `${process.env.FRONTEND_URL}/auth/verify-email?token=${user.verificationToken}`;
    await this.mailService.sendVerificationEmail(user.email, verifyLink);
  }
}
