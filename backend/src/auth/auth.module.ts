import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { Token } from './entities/token.entity';
import { AuthService } from './auth.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenCleanupService } from './token-cleanup.service';
import { TokenService } from './token.service';
import { ProfileService } from './profile.service';

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
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    TokenCleanupService,
    TokenService,
    ProfileService,
  ],
  exports: [AuthService, JwtStrategy, TokenService],
})
export class AuthModule {}
