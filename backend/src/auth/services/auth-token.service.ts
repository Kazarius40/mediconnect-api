import { Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Token } from '../entities/token.entity';
import { User } from '../entities/user.entity';
import { ITokens } from '../interfaces/tokens.interface';
import { IJWTPayload } from '../interfaces/jwt-payload.interface';
import { handleDb } from '../../shared/utils/db/handle-db.util';
import { Response } from 'express';
import { RequestWithCookies } from '../../shared/interfaces/request-with-cookies.interface';

@Injectable()
export class AuthTokenService {
  readonly accessTokenExpiresIn: number;
  readonly refreshTokenExpiresIn: number;

  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenExpiresIn = this.configService.get<number>(
      'ACCESS_TOKEN_EXPIRATION_TIME',
    )!;
    this.refreshTokenExpiresIn = this.configService.get<number>(
      'REFRESH_TOKEN_EXPIRATION_TIME',
    )!;

    if (isNaN(this.accessTokenExpiresIn) || isNaN(this.refreshTokenExpiresIn)) {
      throw new Error(
        'Token expiration times are not configured correctly. Ensure ACCESS_TOKEN_EXPIRATION_TIME and REFRESH_TOKEN_EXPIRATION_TIME are set.',
      );
    }
  }

  async generateAndSaveTokens(user: User): Promise<ITokens> {
    const jti = this.generateJti();
    const payload = this.createPayload(user.id, user.email, user.role, jti);

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: `${this.accessTokenExpiresIn}s`,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: `${this.refreshTokenExpiresIn}s`,
    });

    await this.saveTokens(user, refreshToken, jti);

    return { accessToken, refreshToken };
  }

  async refresh(
    @Req() req: RequestWithCookies,
    @Res() res: Response,
  ): Promise<ITokens> {
    const refreshToken: string | undefined = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    let payload: IJWTPayload;
    try {
      payload = this.jwtService.verify<IJWTPayload>(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!payload.jti) {
      throw new UnauthorizedException('Refresh token payload is missing jti');
    }

    const tokenEntity = await this.tokenRepository.findOne({
      where: {
        refreshToken: refreshToken,
        jti: payload.jti,
        isBlocked: false,
      },
      relations: ['user'],
    });

    if (
      !tokenEntity ||
      tokenEntity.isBlocked ||
      !tokenEntity.user ||
      tokenEntity.refreshTokenExpiresAt < new Date()
    ) {
      throw new UnauthorizedException(
        'Invalid, blocked or expired refresh token',
      );
    }

    await this.blockToken(tokenEntity);

    const tokens = await this.generateAndSaveTokens(tokenEntity.user);

    this.setRefreshCookie(res, tokens.refreshToken);

    return tokens;
  }

  async logOut(refreshToken: string): Promise<void> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { refreshToken, isBlocked: false },
    });

    if (!tokenEntity) {
      throw new UnauthorizedException(
        'Invalid or already logged out refresh token',
      );
    }

    await this.blockToken(tokenEntity);
  }

  async invalidateUserTokens(userId: number): Promise<void> {
    const tokens = await this.tokenRepository.find({
      where: { user: { id: userId }, isBlocked: false },
    });

    for (const token of tokens) {
      token.isBlocked = true;
    }

    await handleDb(() => this.tokenRepository.save(tokens));
  }

  setRefreshCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: this.refreshTokenExpiresIn * 1000,
    });
  }

  clearAuthCookies(res: Response): void {
    res.clearCookie('refreshToken');
  }

  private async blockToken(token: Token): Promise<void> {
    token.isBlocked = true;
    await handleDb(() => this.tokenRepository.save(token));
  }

  private generateJti(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private createPayload(
    sub: number,
    email: string,
    role: string,
    jti: string,
  ): IJWTPayload {
    return { sub, email, role, jti };
  }

  private async saveTokens(
    user: User,
    refreshToken: string,
    jti: string,
  ): Promise<void> {
    const tokenEntity = this.tokenRepository.create({
      refreshToken,
      accessTokenExpiresAt: new Date(
        Date.now() + this.accessTokenExpiresIn * 1000,
      ),
      refreshTokenExpiresAt: new Date(
        Date.now() + this.refreshTokenExpiresIn * 1000,
      ),
      user,
      jti,
      isBlocked: false,
    });

    await handleDb(() => this.tokenRepository.save(tokenEntity));
  }
}
