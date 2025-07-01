import { ApiTags } from '@nestjs/swagger';
import {
  applyDecorators,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DoctorService } from '../services/doctor.service';
import { FilterDoctorDto } from '../dto/filter-doctor.dto';
import { Doctor } from '../entities/doctor.entity';
import {
  FindAllDoctorsDocs,
  FindOneDoctorDocs,
} from '../../swagger/methods/doctors/public-doctor-docs.swagger';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorPublicController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @applyDecorators(...FindAllDoctorsDocs)
  async findAll(@Query() filterDto: FilterDoctorDto): Promise<Doctor[]> {
    return this.doctorService.findAll(filterDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @applyDecorators(...FindOneDoctorDocs)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Doctor> {
    return this.doctorService.findOne(id);
  }
}
