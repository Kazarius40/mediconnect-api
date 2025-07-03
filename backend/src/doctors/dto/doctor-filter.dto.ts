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
} from '../../swagger/methods/doctors/doctor-filter-dto.swagger';
import { getFilteredFields } from '../../shared/validators/get-required-fields.util';
import { DoctorCreateDto } from './doctor-create.dto';
import { TransformToNumberArray } from '../../shared/utils/decorators/transform-to-number-array.decorator';

const scalarFields = getFilteredFields(DoctorCreateDto, [], true);

export class DoctorFilterDto {
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
  @TransformToNumberArray()
  clinicIds?: number[];

  @DoctorServiceIdsSwagger()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @TransformToNumberArray()
  serviceIds?: number[];

  @DoctorSortBySwagger(scalarFields)
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
