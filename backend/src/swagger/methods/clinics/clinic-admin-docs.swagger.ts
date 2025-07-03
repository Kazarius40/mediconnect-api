import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClinicCreateDto } from '../../../clinics/dto/clinic-create.dto';
import { ClinicResponse } from '../../responses/clinic-response.swagger';
import { ClinicUpdateDto } from '../../../clinics/dto/clinic-update.dto';

export function CreateClinicDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new clinic (Admin only)' }),
    ApiBody({ type: ClinicCreateDto, description: 'Clinic creation data' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Clinic successfully created.',
      type: ClinicResponse,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid data provided.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Clinic with this name, email or phone already exists.',
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

export function PutClinicDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Fully update a clinic by ID (Admin only)',
      description:
        'Fully replaces the clinic. Missing fields will be set to null or defaults. Use for complete updates.',
    }),
    ApiBody({
      type: ClinicCreateDto,
      description: 'Clinic update data (full)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Clinic successfully updated (full).',
      type: ClinicResponse,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid data provided.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Clinic not found.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Clinic with this name, email or phone already exists.',
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

export function PatchClinicDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Partially update clinic by ID (Admin only)',
      description: 'Updates only the fields provided in the request body.',
    }),
    ApiBody({
      type: ClinicUpdateDto,
      description: 'Clinic update data (partial)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Clinic successfully updated (partial).',
      type: ClinicResponse,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid data provided.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Clinic not found.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Clinic with this name, email or phone already exists.',
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

export function DeleteClinicDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete clinic by ID (Admin only)' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Clinic successfully deleted.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Clinic not found.',
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
