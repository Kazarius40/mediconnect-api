import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  applyDecorators,
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
import { UserRole } from '../../users/user-role.enum';
import { DoctorService } from '../services/doctor.service';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { Doctor } from '../entities/doctor.entity';
import { UpdateDoctorDto } from '../dto/update-doctor';
import {
  CreateDoctorDocs,
  DeleteDoctorDocs,
  PatchDoctorDocs,
  UpdateDoctorDocs,
} from '../../swagger/methods/doctor/admin-docs.swagger';

@ApiTags('Doctors (Admin)')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('doctors')
export class DoctorAdminController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @applyDecorators(...CreateDoctorDocs)
  async create(@Body() dto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @applyDecorators(...UpdateDoctorDocs)
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorService.put(id, dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @applyDecorators(...PatchDoctorDocs)
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorService.patch(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @applyDecorators(...DeleteDoctorDocs)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.doctorService.delete(id);
  }
}
