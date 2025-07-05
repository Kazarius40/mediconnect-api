import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Token } from '../entities/token.entity';
import { User } from '../entities/user.entity';
import { ITokens } from '../interfaces/tokens.interface';
import { AuthRefreshTokenDto } from '../dto/auth-refresh-token.dto';
import { IJWTPayload } from '../interfaces/jwt-payload.interface';
import { handleDb } from '../../shared/utils/db/handle-db.util';

@Injectable()
export class AuthTokenService {
  private readonly accessTokenExpiresIn: number;
  private readonly refreshTokenExpiresIn: number;

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
        'Token expiration times are not configured correctly. Ensure ACCESS_TOKEN_EXPIRATION_TIME and REFRESH_TOKEN_EXPIRATION_TIME are set to numbers in .env',
      );
    }
  }

  /**
   * Generate new access & refresh tokens, save it to DB, block old tokens if exist
   */
  async generateAndSaveTokens(user: User): Promise<ITokens> {
    const existingToken = await this.tokenRepository.findOne({
      where: { user: { id: user.id }, isBlocked: false },
    });

    if (existingToken) {
      await this.blockToken(existingToken);
    }

    const jti = this.generateJti();
    const payload = this.createPayload(user.id, user.email, user.role, jti);

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: `${this.accessTokenExpiresIn}s`,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: `${this.refreshTokenExpiresIn}s`,
    });

    await this.saveTokens(
      user,
      accessToken,
      refreshToken,
      this.accessTokenExpiresIn,
      this.refreshTokenExpiresIn,
      jti,
    );

    return { accessToken, refreshToken };
  }

  /**
   * Verify and refresh tokens using provided refresh token DTO
   */
  async refresh(refreshTokenDto: AuthRefreshTokenDto): Promise<ITokens> {
    const { refreshToken } = refreshTokenDto;
    let payload: IJWTPayload;

    try {
      payload = this.jwtService.verify<IJWTPayload>(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!payload.jti) {
      throw new UnauthorizedException(
        'Invalid refresh token payload: jti missing',
      );
    }

    const tokenEntity = await this.tokenRepository.findOne({
      where: { refreshToken, jti: payload.jti, isBlocked: false },
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

    return this.generateAndSaveTokens(tokenEntity.user);
  }

  /**
   * Log out by blocking refresh token
   */
  async logOut(refreshToken: string): Promise<void> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { refreshToken, isBlocked: false },
      relations: ['user'],
    });

    if (!tokenEntity) {
      throw new UnauthorizedException(
        'Invalid or already logged out refresh token',
      );
    }

    await this.blockToken(tokenEntity);
  }

  /**
   * Mark token as blocked to invalidate it
   */
  private async blockToken(token: Token): Promise<void> {
    token.isBlocked = true;
    await handleDb(() => this.tokenRepository.save(token));
  }

  /**
   * Generate unique token identifier (jti)
   */
  private generateJti(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Create JWT payload
   */
  private createPayload(
    sub: number,
    email: string,
    role: string,
    jti: string,
  ): IJWTPayload {
    return { sub, email, role, jti };
  }

  /**
   * Persist access & refresh tokens in DB with expiration dates
   */
  private async saveTokens(
    user: User,
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn: number,
    refreshTokenExpiresIn: number,
    jti: string,
  ): Promise<void> {
    const tokenEntity = this.tokenRepository.create({
      accessToken,
      refreshToken,
      accessTokenExpiresAt: new Date(Date.now() + accessTokenExpiresIn * 1000),
      refreshTokenExpiresAt: new Date(
        Date.now() + refreshTokenExpiresIn * 1000,
      ),
      user,
      jti,
      isBlocked: false,
    });
    await handleDb(() => this.tokenRepository.save(tokenEntity));
  }
}
