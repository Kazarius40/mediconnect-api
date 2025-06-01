import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ITokens } from './interfaces/tokens.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { IJWTPayload } from './interfaces/jwt-payload.interface';
import { SafeUser } from './interfaces/safe-user.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private readonly accessTokenExpiresIn: number;
  private readonly refreshTokenExpiresIn: number;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenExpiresIn =
      this.configService.get<number>('ACCESS_TOKEN_EXPIRATION_TIME') ?? 3600;
    this.refreshTokenExpiresIn =
      this.configService.get<number>('REFRESH_TOKEN_EXPIRATION_TIME') ?? 86400;
  }

  async removeExpiredTokens(): Promise<number> {
    const now = new Date();

    const deleteResult = await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .where('refreshTokenExpiresAt <= :now OR isBlocked = :blocked', {
        now,
        blocked: true,
      })
      .execute();

    this.logger.log(`Видалено токенів: ${deleteResult.affected || 0}`);

    return deleteResult.affected || 0;
  }

  async register(registerDto: RegisterDto): Promise<SafeUser> {
    const existingUser = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const user = this.userRepository.create(registerDto);
    await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    this.logger.log(`User registered: ${user.email}`);
    return safeUser;
  }

  async login(loginDto: LoginDto): Promise<ITokens> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const tokens = await this.generateTokensAndSave(user);

    this.logger.log(`User logged in: ${user.email}`);
    return tokens;
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
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    tokenEntity.isBlocked = true;
    await this.tokenRepository.save(tokenEntity);

    const tokens = await this.generateTokensAndSave(tokenEntity.user);

    this.logger.log(
      `Refresh token rotated for user: ${tokenEntity.user.email}`,
    );
    return tokens;
  }

  async logOut(refreshTokenDto: RefreshTokenDto): Promise<void> {
    const { refreshToken } = refreshTokenDto;
    const tokenEntity = await this.tokenRepository.findOne({
      where: { refreshToken, isBlocked: false },
    });

    if (tokenEntity) {
      tokenEntity.isBlocked = true;
      await this.tokenRepository.save(tokenEntity);
      this.logger.log(`User logged out: ${tokenEntity.user.email}`);
    }
  }

  private async generateTokensAndSave(user: User): Promise<ITokens> {
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
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user || !(await user.validatePassword(password))) {
      this.logger.warn(`Failed login attempt for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
