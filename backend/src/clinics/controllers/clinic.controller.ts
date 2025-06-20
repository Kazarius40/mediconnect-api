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
  Logger,
} from '@nestjs/common';
import { ClinicService } from '../services/clinic.service';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { Clinic } from '../entities/clinic.entity';
import { FilterClinicDto } from '../dto/filter-clinic.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { UpdateClinicDto } from '../dto/update-clinic.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/user-role.enum';
import {
  ClinicListResponse,
  ClinicResponse,
} from '../swagger/clinic-response.swagger';
import { MessageResponse } from '../../swagger/responses/common-responses.swagger';

@ApiTags('Clinics')
@Controller('clinics')
export class ClinicController {
  private readonly logger = new Logger(ClinicController.name);

  constructor(private readonly clinicService: ClinicService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new clinic (Admin only)' })
  @ApiBody({ type: CreateClinicDto, description: 'Clinic creation data' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Clinic successfully created.',
    type: ClinicResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Clinic with this name, email or phone already exists.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateClinicDto): Promise<Clinic> {
    const clinic = await this.clinicService.create(dto);
    this.logger.log(
      `Clinic '${clinic.name}' with ID ${clinic.id} created successfully.`,
    );
    return clinic;
  }

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

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Completely update a clinic by ID (Admin only)',
    description:
      'Fully replaces the clinic. Missing fields will be set to null or defaults. Use for complete updates.',
  })
  @ApiBody({ type: CreateClinicDto, description: 'Clinic update data (full)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clinic successfully updated (full).',
    type: ClinicResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Clinic not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Clinic with this name, email or phone already exists.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateClinicDto,
  ): Promise<Clinic> {
    const clinic = await this.clinicService.put(id, dto);
    this.logger.log(`Clinic with ID ${clinic.id} updated successfully.`);
    return clinic;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Partially update clinic information by ID (Admin only)',
    description: 'Updates only the fields provided in the request body.',
  })
  @ApiBody({
    type: UpdateClinicDto,
    description: 'Clinic update data (partial)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clinic successfully updated (partial).',
    type: ClinicResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Clinic not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Clinic with this name, email or phone already exists.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @HttpCode(HttpStatus.OK)
  async partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClinicDto,
  ): Promise<Clinic> {
    const clinic = await this.clinicService.patch(id, dto);
    this.logger.log(
      `Clinic with ID ${clinic.id} partially updated successfully.`,
    );
    return clinic;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete clinic by ID (Admin only)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Clinic successfully deleted.',
    type: MessageResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Clinic not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.clinicService.delete(id);
    this.logger.log(`Clinic with ID ${id} deleted successfully.`);
  }
}
