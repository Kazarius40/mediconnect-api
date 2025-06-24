import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CreateDoctorDto } from '../../../doctors/dto/create-doctor.dto';
import { DoctorResponse } from '../../responses/doctor-response.swagger';
import { UpdateDoctorDto } from '../../../doctors/dto/update-doctor';
import { MessageResponse } from '../../responses/common-responses.swagger';

export const CreateDoctorDocs = [
  ApiOperation({ summary: 'Create a new doctor (Admin only)' }),
  ApiBody({ type: CreateDoctorDto }),
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
  ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied.' }),
  ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  }),
];

export const PutDoctorDocs = [
  ApiOperation({ summary: 'Fully update doctor by ID (Admin only)' }),
  ApiBody({ type: CreateDoctorDto }),
  ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated.',
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
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  }),
  ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied.' }),
  ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  }),
];

export const PatchDoctorDocs = [
  ApiOperation({ summary: 'Partially update doctor by ID (Admin only)' }),
  ApiBody({ type: UpdateDoctorDto }),
  ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated.',
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
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  }),
  ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied.' }),
  ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  }),
];

export const DeleteDoctorDocs = [
  ApiOperation({ summary: 'Delete doctor by ID (Admin only)' }),
  ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully deleted.',
    type: MessageResponse,
  }),
  ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Doctor not found.',
  }),
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  }),
  ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied.' }),
  ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  }),
];
