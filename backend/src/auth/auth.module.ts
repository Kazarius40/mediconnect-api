import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Token } from './entities/token.entity';
import { AuthService } from './services/auth.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenCleanupService } from './services/token-cleanup.service';
import { TokenService } from './services/token.service';
import { ProfileService } from './services/profile.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { ProfileController } from './controllers/profile.controller';
import { AdminController } from './controllers/admin.controller';
import { PasswordController } from './controllers/password.controller';

@Module({
  imports: [
    ScheduleModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<number>('ACCESS_TOKEN_EXPIRATION_TIME')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Token]),
  ],
  controllers: [
    AuthController,
    ProfileController,
    AdminController,
    PasswordController,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    TokenCleanupService,
    TokenService,
    ProfileService,
  ],
  exports: [AuthService, JwtStrategy, TokenService],
})
export class AuthModule {}
