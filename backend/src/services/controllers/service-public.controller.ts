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
import { ServiceService } from '../services/service.service';
import { Service } from '../entities/service.entity';
import { ApiTags } from '@nestjs/swagger';
import { ServiceFilterDto } from '../dto/service-filter.dto';
import {
  FindAllServicesDocs,
  FindOneServiceDocs,
} from '../../swagger/methods/services/service-public-docs.swagger';

@Controller('services')
@ApiTags('Services')
export class ServicePublicController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @applyDecorators(...FindAllServicesDocs)
  async findAll(@Query() filterDto: ServiceFilterDto): Promise<Service[]> {
    return this.serviceService.findAll(filterDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @applyDecorators(...FindOneServiceDocs)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Service> {
    return this.serviceService.findOne(id);
  }
}
