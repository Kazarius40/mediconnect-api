import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
import { UserRole } from '../../shared/enums/user-role.enum';
import { DoctorService } from '../services/doctor.service';
import { DoctorCreateDto } from '../dto/doctor-create.dto';
import { Doctor } from '../entities/doctor.entity';
import {
  CreateDoctorDocs,
  DeleteDoctorDocs,
  PatchDoctorDocs,
  PutDoctorDocs,
} from '../../swagger/methods/doctors/doctor-admin-docs.swagger';
import { DoctorUpdateDto } from '../dto/doctor-update';

@Controller('doctors')
@ApiTags('Doctors (Admin)')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class DoctorAdminController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateDoctorDocs()
  async create(@Body() dto: DoctorCreateDto): Promise<Doctor> {
    return this.doctorService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @PutDoctorDocs()
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DoctorCreateDto,
  ): Promise<Doctor> {
    return this.doctorService.update(id, dto, 'put');
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @PatchDoctorDocs()
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DoctorUpdateDto,
  ): Promise<Doctor> {
    return this.doctorService.update(id, dto, 'patch');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteDoctorDocs()
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.doctorService.delete(id);
  }
}
