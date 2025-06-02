import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { Clinic } from './clinic.entity';
import { FilterClinicDto } from './dto/filter-clinic.dto';

@Controller('clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Post()
  async create(@Body() createClinicDto: CreateClinicDto): Promise<Clinic> {
    return this.clinicService.createClinic(createClinicDto);
  }

  @Get()
  async findAll(@Query() filterDto: FilterClinicDto): Promise<Clinic[]> {
    return this.clinicService.getAllClinics(filterDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Clinic> {
    return this.clinicService.getClinicById(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.clinicService.deleteClinic(id);
  }
}
