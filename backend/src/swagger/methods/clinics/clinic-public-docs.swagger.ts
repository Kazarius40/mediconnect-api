import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import {
  ClinicListResponse,
  ClinicResponse,
} from '../../responses/clinic-response.swagger';

export const FindAllClinicsDocs = [
  ApiOperation({
    summary:
      'Get a list of all clinics with filtering and sorting capabilities',
  }),
  ApiResponse({
    status: HttpStatus.OK,
    description: 'List of clinics successfully retrieved.',
    type: ClinicListResponse,
  }),
  ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  }),
];

export const FindOneClinicDocs = [
  ApiOperation({ summary: 'Get clinic by ID' }),
  ApiResponse({
    status: HttpStatus.OK,
    description: 'Clinic information successfully retrieved.',
    type: ClinicResponse,
  }),
  ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Clinic not found.',
  }),
  ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  }),
];
