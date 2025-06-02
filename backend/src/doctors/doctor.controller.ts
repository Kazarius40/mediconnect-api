import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctor } from './doctor.entity';
import { FilterDoctorDto } from './dto/filter-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @ApiOperation({ summary: 'Створити нового лікаря' })
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorService.create(createDoctorDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Отримати список всіх лікарів з фільтрацією та сортуванням',
  })
  async findAll(@Query() filterDto: FilterDoctorDto): Promise<Doctor[]> {
    return this.doctorService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати лікаря за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Doctor> {
    const doctor = await this.doctorService.findOne(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Повністю оновити інформацію про лікаря' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Частково оновити інформацію про лікаря' })
  async partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити лікаря' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.doctorService.remove(id);
    return { message: `Doctor with ID ${id} deleted successfully` };
  }
}
