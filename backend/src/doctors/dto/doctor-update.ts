import { PartialType } from '@nestjs/swagger';
import { DoctorCreateDto } from './doctor-create.dto';

export class DoctorUpdateDto extends PartialType(DoctorCreateDto) {}
