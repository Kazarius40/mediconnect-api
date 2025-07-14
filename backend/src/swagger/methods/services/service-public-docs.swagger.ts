import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import {
  ServiceListResponse,
  ServiceResponse,
} from '../../responses/service-response.swagger';

export const FindAllServicesDocs = [
  ApiOperation({
    summary:
      'Get a list of all services with filtering and sorting capabilities',
  }),
  ApiResponse({
    status: HttpStatus.OK,
    description: 'List of services successfully retrieved.',
    type: ServiceListResponse,
  }),
  ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  }),
];

export const FindOneServiceDocs = [
  ApiOperation({ summary: 'Get service by ID' }),
  ApiResponse({
    status: HttpStatus.OK,
    description: 'ClinicInterface information successfully retrieved.',
    type: ServiceResponse,
  }),
  ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'ClinicInterface not found.',
  }),
  ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  }),
];
