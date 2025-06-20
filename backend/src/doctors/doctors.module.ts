import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { DoctorService } from './services/doctor.service';
import { Service } from '../services/entities/service.entity';
import { ClinicsModule } from '../clinics/clinics.module';
import { ServiceModule } from '../services/service.module';
import { DoctorAdminController } from './controllers/doctor-admin.controller';
import { DoctorPublicController } from './controllers/doctor-public.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, Service]),
    ClinicsModule,
    ServiceModule,
  ],
  providers: [DoctorService],
  controllers: [DoctorAdminController, DoctorPublicController],
  exports: [DoctorService],
})
export class DoctorsModule {}
