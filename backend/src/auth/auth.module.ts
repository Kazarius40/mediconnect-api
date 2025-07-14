import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthSessionController } from './controllers/auth-session.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Token } from './entities/token.entity';
import { AuthAdminService } from './services/auth-admin.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenCleanupService } from './services/token-cleanup.service';
import { AuthTokenService } from './services/auth-token.service';
import { AuthProfileService } from './services/auth-profile.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthProfileController } from './controllers/auth-profile.controller';
import { AuthAdminController } from './controllers/auth-admin.controller';
import { AuthPasswordController } from './controllers/auth-password.controller';
import { AuthSessionService } from './services/auth-session.service';

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
    AuthSessionController,
    AuthProfileController,
    AuthAdminController,
    AuthPasswordController,
  ],
  providers: [
    AuthAdminService,
    JwtStrategy,
    JwtRefreshStrategy,
    TokenCleanupService,
    AuthTokenService,
    AuthProfileService,
    AuthSessionService,
  ],
  exports: [AuthAdminService, JwtStrategy, AuthTokenService],
})
export class AuthModule {}
