import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClinicService } from '../services/clinic.service';
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
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user-role.enum';
import { ClinicCreateDto } from '../dto/clinic-create.dto';
import { Clinic } from '../entities/clinic.entity';
import { ClinicUpdateDto } from '../dto/clinic-update.dto';
import {
  CreateClinicDocs,
  DeleteClinicDocs,
  PatchClinicDocs,
  PutClinicDocs,
} from '../../swagger/methods/clinics/clinic-admin-docs.swagger';

@ApiTags('Clinics (Admin)')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('clinics')
export class ClinicAdminController {
  constructor(private readonly clinicService: ClinicService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateClinicDocs()
  async create(@Body() dto: ClinicCreateDto): Promise<Clinic> {
    return this.clinicService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @PutClinicDocs()
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ClinicCreateDto,
  ): Promise<Clinic> {
    return this.clinicService.update(id, dto, 'put');
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PatchClinicDocs()
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ClinicUpdateDto,
  ): Promise<Clinic> {
    return this.clinicService.update(id, dto, 'patch');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteClinicDocs()
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.clinicService.delete(id);
  }
}
