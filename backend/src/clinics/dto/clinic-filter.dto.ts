import { IsArray, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  ClinicAddressSwagger,
  ClinicDoctorIdsSwagger,
  ClinicEmailSwagger,
  ClinicNameSwagger,
  ClinicPhoneSwagger,
  ClinicServiceIdsSwagger,
  ClinicSortBySwagger,
  ClinicSortOrderSwagger,
} from '../../swagger/methods/clinics/clinics-filter-dto.swagger';
import { TransformToNumberArray } from '../../shared/utils/decorators/transform-to-number-array.decorator';
import { getFilteredFields } from '../../shared/validators/get-required-fields.util';
import { ClinicCreateDto } from './clinic-create.dto';

const scalarFields = getFilteredFields(ClinicCreateDto, []);

export class ClinicFilterDto {
  @ClinicNameSwagger()
  @IsOptional()
  @IsString()
  name?: string;

  @ClinicAddressSwagger()
  @IsOptional()
  @IsString()
  address?: string;

  @ClinicPhoneSwagger()
  @IsOptional()
  @IsString()
  phone?: string;

  @ClinicEmailSwagger()
  @IsOptional()
  @IsString()
  email?: string;

  @ClinicDoctorIdsSwagger()
  @IsOptional()
  @TransformToNumberArray()
  @IsArray()
  @IsNumber({}, { each: true })
  doctorIds?: number[];

  @ClinicServiceIdsSwagger()
  @IsOptional()
  @TransformToNumberArray()
  @IsArray()
  @IsNumber({}, { each: true })
  serviceIds?: number[];

  @ClinicSortBySwagger(scalarFields)
  @IsOptional()
  @IsString()
  @IsIn(scalarFields)
  sortBy?: string;

  @ClinicSortOrderSwagger()
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
