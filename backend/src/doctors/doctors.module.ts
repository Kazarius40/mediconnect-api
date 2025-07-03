import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { DoctorService } from './services/doctor.service';
import { Service } from '../services/entities/service.entity';
import { DoctorAdminController } from './controllers/doctor-admin.controller';
import { DoctorPublicController } from './controllers/doctor-public.controller';
import { Clinic } from '../clinics/entities/clinic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Service, Clinic])],
  controllers: [DoctorAdminController, DoctorPublicController],
  providers: [DoctorService],
  exports: [DoctorService],
})
export class DoctorsModule {}
