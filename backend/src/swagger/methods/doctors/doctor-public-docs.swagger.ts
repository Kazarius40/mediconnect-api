import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import {
  DoctorListResponse,
  DoctorResponse,
} from '../../responses/doctor-response.swagger';

export const FindAllDoctorsDocs = [
  ApiOperation({
    summary:
      'Get a list of all doctors with filtering and sorting capabilities',
  }),
  ApiResponse({
    status: HttpStatus.OK,
    description: 'List of doctors successfully retrieved.',
    type: DoctorListResponse,
  }),
  ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  }),
];

export const FindOneDoctorDocs = [
  ApiOperation({ summary: 'Get doctor by ID' }),
  ApiResponse({
    status: HttpStatus.OK,
    description: 'ClinicInterface information successfully retrieved.',
    type: DoctorResponse,
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
