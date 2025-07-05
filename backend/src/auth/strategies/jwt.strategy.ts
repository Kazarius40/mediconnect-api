import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRole } from '../../shared/enums/user-role.enum';
import { Token } from '../entities/token.entity';
import { User } from '../entities/user.entity';
import { IJWTPayload } from '../interfaces/jwt-payload.interface';

interface ReturnedUserPayload {
  id: number;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  jti: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Validate JWT payload:
   * - Check presence of jti
   * - Verify token not blocked
   * - Verify user exists
   * - Return safe user payload with jti
   */
  async validate(payload: IJWTPayload): Promise<ReturnedUserPayload> {
    if (!payload.jti) {
      throw new UnauthorizedException('Invalid token: jti is missing');
    }

    const tokenEntity = await this.tokenRepository.findOne({
      where: { jti: payload.jti, isBlocked: false },
    });

    if (!tokenEntity) {
      throw new UnauthorizedException('Token is blocked or invalid');
    }

    const user = await this.userRepository.findOneBy({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Remove sensitive fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return {
      ...safeUser,
      jti: payload.jti,
    } as ReturnedUserPayload;
  }
}
