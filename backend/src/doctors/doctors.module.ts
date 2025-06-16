import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { DoctorService } from './services/doctor.service';
import { DoctorController } from './controllers/doctor.controller';
import { Service } from '../services/entities/service.entity';
import { ClinicsModule } from '../clinics/clinics.module';
import { ServiceModule } from '../services/service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, Service]),
    ClinicsModule,
    ServiceModule,
  ],
  providers: [DoctorService],
  controllers: [DoctorController],
  exports: [DoctorService],
})
export class DoctorsModule {}
