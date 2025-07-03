import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DoctorCreateDto } from '../../../doctors/dto/doctor-create.dto';
import { DoctorResponse } from '../../responses/doctor-response.swagger';
import { DoctorUpdateDto } from '../../../doctors/dto/doctor-update';

export function CreateDoctorDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new doctor (Admin only)' }),
    ApiBody({ type: DoctorCreateDto, description: 'Doctor creation data' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Doctor successfully created.',
      type: DoctorResponse,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid data provided.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Email or phone already exists.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Access denied.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error.',
    }),
  );
}

export function PutDoctorDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Fully update a doctor by ID (Admin only)',
      description:
        'Fully replaces the doctor. Missing fields will be set to null or defaults. Use for complete updates.',
    }),
    ApiBody({
      type: DoctorCreateDto,
      description: 'Doctor update data (full)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Doctor successfully updated (full).',
      type: DoctorResponse,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid data provided.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Doctor not found.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Doctor with this email or phone already exists.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Access denied.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error.',
    }),
  );
}

export function PatchDoctorDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Partially update doctor by ID (Admin only)',
      description: 'Updates only the fields provided in the request body.',
    }),
    ApiBody({
      type: DoctorUpdateDto,
      description: 'Doctor update data (partial)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Doctor successfully updated (partial).',
      type: DoctorResponse,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid data provided.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Doctor not found.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Doctor with this email or phone already exists.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Access denied.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error.',
    }),
  );
}

export function DeleteDoctorDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete doctor by ID (Admin only)' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Doctor successfully deleted.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Doctor not found.',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Access denied.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error.',
    }),
  );
}
