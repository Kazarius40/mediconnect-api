import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinic } from './entities/clinic.entity';
import { ClinicService } from './services/clinic.service';
import { Doctor } from '../doctors/entities/doctor.entity';
import { ClinicAdminController } from './controllers/clinic-admin.controller';
import { ClinicPublicController } from './controllers/clinic-public.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic, Doctor])],
  controllers: [ClinicAdminController, ClinicPublicController],
  providers: [ClinicService],
  exports: [ClinicService],
})
export class ClinicsModule {}
