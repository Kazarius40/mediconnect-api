import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './service.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { FilterServiceDto } from './dto/filter-service.dto';

@ApiTags('Services')
@ApiBearerAuth()
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Створити нову послугу' })
  @ApiResponse({
    status: 201,
    description: 'Послуга успішно створена.',
    type: Service,
  })
  @ApiResponse({ status: 400, description: 'Некоректні дані.' })
  @ApiResponse({ status: 401, description: 'Не авторизовано.' })
  @ApiResponse({ status: 403, description: 'Відмовлено в доступі.' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Отримати список усіх послуг з можливістю фільтрації та сортування',
  })
  @ApiResponse({
    status: 200,
    description: 'Список послуг успішно отримано.',
    type: [Service],
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filterDto: FilterServiceDto) {
    return this.serviceService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати послугу по ID' })
  @ApiResponse({
    status: 200,
    description: 'Інформація про послугу успішно отримана.',
    type: Service,
  })
  @ApiResponse({ status: 404, description: 'Послугу не знайдено.' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Повне оновлення послуги по ID',
    description:
      'Оновлює повністю усі поля про послугу. Не забудьте врахувати необов`язкві поля, щоб не втратити їх зміст',
  })
  @ApiResponse({
    status: 200,
    description: 'Послуга успішно оновлена (повністю).',
    type: Service,
  })
  @ApiResponse({ status: 400, description: 'Некоректні дані.' })
  @ApiResponse({ status: 401, description: 'Не авторизовано.' })
  @ApiResponse({ status: 403, description: 'Відмовлено в доступі.' })
  @ApiResponse({ status: 404, description: 'Послугу не знайдено.' })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Часткове оновлення інформації про послугу по ID' })
  @ApiResponse({
    status: 200,
    description: 'Послуга успішно оновлена (частково).',
    type: Service,
  })
  @ApiResponse({ status: 400, description: 'Некоректні дані.' })
  @ApiResponse({ status: 401, description: 'Не авторизовано.' })
  @ApiResponse({ status: 403, description: 'Відмовлено в доступі.' })
  @ApiResponse({ status: 404, description: 'Послугу не знайдено.' })
  @HttpCode(HttpStatus.OK)
  partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Видалення послуги по ID' })
  @ApiResponse({ status: 204, description: 'Послуга успішно видалена.' })
  @ApiResponse({ status: 401, description: 'Не авторизовано.' })
  @ApiResponse({ status: 403, description: 'Відмовлено в доступі.' })
  @ApiResponse({ status: 404, description: 'Послугу не знайдено.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.serviceService.remove(id);
  }
}
