import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ServiceCreateDto } from '../../../services/dto/service-create.dto';
import { ServiceUpdateDto } from '../../../services/dto/service-update.dto';
import { ServiceResponse } from '../../responses/service-response.swagger';

export function CreateServiceDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new service (Admin only)' }),
    ApiBody({
      type: ServiceCreateDto,
      description: 'ClinicInterface creation data',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'ClinicInterface successfully created.',
      type: ServiceResponse,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid data provided.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'ClinicInterface with this name already exists.',
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

export function PutServiceDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Fully update a service by ID (Admin only)',
      description:
        'Fully replaces the service. Missing fields will be set to null or defaults. Use for complete updates.',
    }),
    ApiBody({
      type: ServiceCreateDto,
      description: 'ClinicInterface update data (full)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'ClinicInterface successfully updated (full).',
      type: ServiceResponse,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid data provided.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'ClinicInterface not found.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'ClinicInterface with this name already exists.',
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

export function PatchServiceDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Partially update service by ID (Admin only)',
      description: 'Updates only the fields provided in the request body.',
    }),
    ApiBody({
      type: ServiceUpdateDto,
      description: 'ClinicInterface update data (partial)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'ClinicInterface successfully updated (partial).',
      type: ServiceResponse,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid data provided.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'ClinicInterface not found.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'ClinicInterface with this name already exists.',
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

export function DeleteServiceDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete service by ID (Admin only)' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'ClinicInterface successfully deleted.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'ClinicInterface not found.',
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
