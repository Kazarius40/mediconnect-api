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
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { Clinic } from '../entities/clinic.entity';
import { UpdateClinicDto } from '../dto/update-clinic.dto';
import {
  CreateClinicDocs,
  DeleteClinicDocs,
  PatchClinicDocs,
  PutClinicDocs,
} from '../../swagger/methods/clinics/clinic-doctor-docs.swagger';

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
  async create(@Body() dto: CreateClinicDto): Promise<Clinic> {
    return await this.clinicService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @PutClinicDocs()
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateClinicDto,
  ): Promise<Clinic> {
    return await this.clinicService.put(id, dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PatchClinicDocs()
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClinicDto,
  ): Promise<Clinic> {
    return await this.clinicService.patch(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteClinicDocs()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.clinicService.delete(id);
  }
}
