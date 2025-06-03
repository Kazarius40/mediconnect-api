import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinic } from './clinic.entity';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';
import { Doctor } from '../doctors/doctor.entity';
import { Service } from '../services/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic, Doctor, Service])],
  providers: [ClinicService],
  controllers: [ClinicController],
  exports: [ClinicService, TypeOrmModule],
})
export class ClinicsModule {}
