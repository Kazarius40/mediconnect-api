import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeormModule } from './typeorm.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ServiceModule } from './services/service.module';
import { DoctorsModule } from './doctors/doctors.module';
import { ClinicsModule } from './clinics/clinics.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env' : ['.env.local', '.env'],
      validationSchema: Joi.object({
        ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),
        REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required(),

        DB_TYPE: Joi.string().valid('mysql').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      }),
    }),
    TypeormModule,
    AuthModule,
    ServiceModule,
    DoctorsModule,
    ClinicsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
