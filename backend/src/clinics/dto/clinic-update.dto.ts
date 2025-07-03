import { PartialType } from '@nestjs/swagger';
import { ClinicCreateDto } from './clinic-create.dto';

export class ClinicUpdateDto extends PartialType(ClinicCreateDto) {}
