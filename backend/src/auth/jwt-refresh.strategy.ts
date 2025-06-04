import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IJWTPayload } from './interfaces/jwt-payload.interface';
import { Token } from './entities/token.entity';
import { User } from './entities/user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: IJWTPayload) {
    if (!payload.jti) {
      throw new UnauthorizedException(
        'Invalid refresh token payload: jti missing',
      );
    }

    const tokenEntity = await this.tokenRepository.findOne({
      where: {
        jti: payload.jti,
        isBlocked: false,
      },
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
