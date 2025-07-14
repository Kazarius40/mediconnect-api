import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJWTPayload } from '../interfaces/jwt-payload.interface';
import { Token } from '../entities/token.entity';
import { Request } from 'express';

export interface RequestWithCookies extends Request {
  cookies: {
    refreshToken?: string;
  };
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: RequestWithCookies) => req?.cookies?.refreshToken || null,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Validate refresh token payload:
   * - Check jti presence
   * - Ensure token exists, not blocked, and user exists
   * - Check token expiration
   * - Return minimal user info with a role and jti
   */
  async validate(payload: IJWTPayload) {
    if (!payload.jti) {
      throw new UnauthorizedException(
        'Invalid refresh token payload: jti missing',
      );
    }

    const tokenEntity = await this.tokenRepository.findOne({
      where: { jti: payload.jti, isBlocked: false },
      relations: ['user'],
    });

    if (!tokenEntity || tokenEntity.isBlocked || !tokenEntity.user) {
      throw new UnauthorizedException('Invalid or blocked refresh token');
    }

    if (tokenEntity.refreshTokenExpiresAt < new Date()) {
      throw new UnauthorizedException('Expired refresh token');
    }

    return {
      userId: tokenEntity.user.id,
      email: tokenEntity.user.email,
      jti: payload.jti,
      role: tokenEntity.user.role,
    };
  }
}
