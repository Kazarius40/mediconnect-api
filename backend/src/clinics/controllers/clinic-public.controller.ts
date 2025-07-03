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
import { ClinicService } from '../services/clinic.service';
import { Clinic } from '../entities/clinic.entity';
import { ClinicFilterDto } from '../dto/clinic-filter.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  FindAllClinicsDocs,
  FindOneClinicDocs,
} from '../../swagger/methods/clinics/clinic-public-docs.swagger';

@ApiTags('Clinics')
@Controller('clinics')
export class ClinicPublicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @applyDecorators(...FindAllClinicsDocs)
  async findAll(@Query() filterDto: ClinicFilterDto): Promise<Clinic[]> {
    return this.clinicService.findAll(filterDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @applyDecorators(...FindOneClinicDocs)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Clinic> {
    return this.clinicService.findOne(id);
  }
}
