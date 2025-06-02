import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Token } from './entities/token.entity';
import { User } from './entities/user.entity';
import { ITokens } from './interfaces/tokens.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { IJWTPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

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
  }

  async generateAndSaveTokens(user: User): Promise<ITokens> {
    const existingToken = await this.tokenRepository.findOne({
      where: { user: { id: user.id }, isBlocked: false },
    });

    if (existingToken) {
      await this.blockToken(existingToken);
    }

    const jti = this.generateJti();
    const payload = this.createPayload(user.id, user.email, jti);

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

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<ITokens> {
    const { refreshToken } = refreshTokenDto;

    try {
      this.jwtService.verify<IJWTPayload>(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const tokenEntity = await this.tokenRepository.findOne({
      where: { refreshToken, isBlocked: false },
      relations: ['user'],
    });

    if (!tokenEntity || tokenEntity.refreshTokenExpiresAt < new Date()) {
      this.logger.warn(
        `Attempt to use invalid or expired refresh token: ${refreshToken}`,
      );
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.blockToken(tokenEntity);

    const tokens = await this.generateAndSaveTokens(tokenEntity.user);

    this.logger.log(
      `Refresh token rotated for user: ${tokenEntity.user.email}`,
    );
    return tokens;
  }

  async logOut(refreshToken: string): Promise<void> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { refreshToken, isBlocked: false },
      relations: ['user'],
    });

    if (tokenEntity) {
      await this.blockToken(tokenEntity);
      this.logger.log(`User logged out: ${tokenEntity.user.email}`);
    } else {
      this.logger.warn(
        `Attempted to log out with non-existent or blocked token: ${refreshToken}`,
      );
    }
  }

  private async blockToken(token: Token): Promise<void> {
    token.isBlocked = true;
    await this.tokenRepository.save(token);
    this.logger.log(`Token ${token.jti} blocked.`);
  }

  private generateJti(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private createPayload(
    userId: number,
    email: string,
    jti: string,
  ): IJWTPayload {
    return { userId, email, jti };
  }

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
    await this.tokenRepository.save(tokenEntity);
    this.logger.log(`New token saved for user ${user.email} with jti: ${jti}`);
  }
}
