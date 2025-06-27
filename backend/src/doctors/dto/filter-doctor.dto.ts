import { IsArray, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  DoctorClinicIdsSwagger,
  DoctorEmailSwagger,
  DoctorFirstNameSwagger,
  DoctorLastNameSwagger,
  DoctorPhoneSwagger,
  DoctorServiceIdsSwagger,
  DoctorSortBySwagger,
  DoctorSortOrderSwagger,
} from '../../swagger/methods/doctor/filter-doctor-dto.swagger';
import { getFilteredFields } from '../../shared/validators/get-required-fields.util';
import { CreateDoctorDto } from './create-doctor.dto';

const scalarFields = getFilteredFields(CreateDoctorDto, true);

export class FilterDoctorDto {
  @DoctorFirstNameSwagger()
  @IsOptional()
  @IsString()
  firstName?: string;

  @DoctorLastNameSwagger()
  @IsOptional()
  @IsString()
  lastName?: string;

  @DoctorEmailSwagger()
  @IsOptional()
  @IsString()
  email?: string;

  @DoctorPhoneSwagger()
  @IsOptional()
  @IsString()
  phone?: string;

  @DoctorClinicIdsSwagger()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  clinicIds?: number[];

  @DoctorServiceIdsSwagger()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  serviceIds?: number[];

  @DoctorSortBySwagger()
  @IsOptional()
  @IsString()
  @IsIn(scalarFields)
  sortBy?: string;

  @DoctorSortOrderSwagger()
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
