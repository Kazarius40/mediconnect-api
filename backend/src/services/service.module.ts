import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ServicePublicController } from './controllers/service-public.controller';
import { ServiceService } from './services/service.service';
import { ServiceAdminController } from './controllers/service-admin.controller';
import { Doctor } from '../doctors/entities/doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Doctor])],
  controllers: [ServiceAdminController, ServicePublicController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
