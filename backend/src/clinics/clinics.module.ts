import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinic } from './entities/clinic.entity';
import { ClinicService } from './services/clinic.service';
import { ClinicController } from './controllers/clinic-public.controller';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Service } from '../services/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic, Doctor, Service])],
  providers: [ClinicService],
  controllers: [ClinicController],
  exports: [ClinicService, TypeOrmModule],
})
export class ClinicsModule {}
