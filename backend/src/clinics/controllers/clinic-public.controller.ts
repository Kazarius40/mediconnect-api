import {
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
import { FilterClinicDto } from '../dto/filter-clinic.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ClinicListResponse,
  ClinicResponse,
} from '../../swagger/responses/clinic-response.swagger';

@ApiTags('Clinics')
@Controller('clinics')
export class ClinicPublicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get a list of all clinics with filtering and sorting capabilities',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of clinics successfully retrieved.',
    type: ClinicListResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filterDto: FilterClinicDto): Promise<Clinic[]> {
    return this.clinicService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinic by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clinic information successfully retrieved.',
    type: ClinicResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Clinic not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Clinic> {
    return this.clinicService.findOne(id);
  }
}
