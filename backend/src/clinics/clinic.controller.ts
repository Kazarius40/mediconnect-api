import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { Clinic } from './clinic.entity';
import { FilterClinicDto } from './dto/filter-clinic.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';

@ApiTags('Clinics')
@ApiBearerAuth()
@Controller('clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Створити нову клініку' })
  @ApiResponse({
    status: 201,
    description: 'Клініка успішно створена.',
    type: Clinic,
  })
  @ApiResponse({ status: 400, description: 'Некоректні дані.' })
  @ApiResponse({ status: 401, description: 'Не авторизовано.' })
  @ApiResponse({ status: 403, description: 'Відмовлено в доступі.' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createClinicDto: CreateClinicDto): Promise<Clinic> {
    return this.clinicService.createClinic(createClinicDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Отримання список усіх клінік з можливістю фільтрації та сортування',
  })
  @ApiResponse({
    status: 200,
    description: 'Список клінік успішно отримано.',
    type: [Clinic],
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filterDto: FilterClinicDto): Promise<Clinic[]> {
    return this.clinicService.getAllClinics(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати клініку по ID' })
  @ApiResponse({
    status: 200,
    description: 'Інформація про клініку успішно отримана.',
    type: Clinic,
  })
  @ApiResponse({ status: 404, description: 'Клініку не знайдено.' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Clinic> {
    return this.clinicService.getClinicById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Повне оновлення інформації про клініку по ID',
    description:
      'Оновлює повністю усі поля про клініку. Не забудьте врахувати необов`язкві поля, щоб не втратити їх зміст',
  })
  @ApiResponse({
    status: 200,
    description: 'Клініка успішно оновлена.',
    type: Clinic,
  })
  @ApiResponse({ status: 400, description: 'Некоректні дані.' })
  @ApiResponse({ status: 401, description: 'Не авторизовано.' })
  @ApiResponse({ status: 403, description: 'Відмовлено в доступі.' })
  @ApiResponse({ status: 404, description: 'Клініку не знайдено.' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClinicDto: UpdateClinicDto,
  ): Promise<Clinic> {
    return this.clinicService.updateClinic(id, updateClinicDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Частково оновити інформацію про клініку' })
  @ApiResponse({
    status: 200,
    description: 'Клініка успішно оновлена (частково).',
    type: Clinic,
  })
  @ApiResponse({ status: 400, description: 'Некоректні дані.' })
  @ApiResponse({ status: 401, description: 'Не авторизовано.' })
  @ApiResponse({ status: 403, description: 'Відмовлено в доступі.' })
  @ApiResponse({ status: 404, description: 'Клініку не знайдено.' })
  @HttpCode(HttpStatus.OK)
  async partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClinicDto: UpdateClinicDto,
  ): Promise<Clinic> {
    return this.clinicService.updateClinic(id, updateClinicDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Видалити клініку по ID' })
  @ApiResponse({ status: 204, description: 'Клініка успішно видалена.' })
  @ApiResponse({ status: 401, description: 'Не авторизовано.' })
  @ApiResponse({ status: 403, description: 'Відмовлено в доступі.' })
  @ApiResponse({ status: 404, description: 'Клініку не знайдено.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.clinicService.deleteClinic(id);
  }
}
