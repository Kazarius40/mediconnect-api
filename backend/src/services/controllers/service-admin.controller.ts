import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/user-role.enum';
import { ServiceService } from '../services/service.service';
import {
  CreateServiceDocs,
  DeleteServiceDocs,
  PatchServiceDocs,
  PutServiceDocs,
} from 'src/swagger/methods/services/service-admin-docs.swagger';
import { ServiceCreateDto } from '../dto/service-create.dto';
import { Service } from '../entities/service.entity';
import { ServiceUpdateDto } from '../dto/service-update.dto';

@ApiTags('Services (Admin)')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('services')
export class ServiceAdminController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateServiceDocs()
  async create(@Body() dto: ServiceCreateDto): Promise<Service> {
    return this.serviceService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @PutServiceDocs()
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ServiceCreateDto,
  ): Promise<Service> {
    return this.serviceService.update(id, dto, 'put');
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PatchServiceDocs()
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ServiceUpdateDto,
  ): Promise<Service> {
    return this.serviceService.update(id, dto, 'patch');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteServiceDocs()
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.serviceService.delete(id);
  }
}
