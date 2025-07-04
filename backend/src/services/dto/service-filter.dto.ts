import { IsArray, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  ServiceClinicIdsSwagger,
  ServiceDoctorIdsSwagger,
  ServiceNameSwagger,
  ServiceSortBySwagger,
  ServiceSortOrderSwagger,
} from '../../swagger/methods/services/services-filter-dto.swagger';
import { TransformToNumberArray } from '../../shared/utils/decorators/transform-to-number-array.decorator';
import { getFilteredFields } from '../../shared/validators/get-required-fields.util';
import { ServiceCreateDto } from './service-create.dto';

const scalarFields = getFilteredFields(ServiceCreateDto, []);

export class ServiceFilterDto {
  @ServiceNameSwagger()
  @IsOptional()
  @IsString()
  name?: string;

  @ServiceDoctorIdsSwagger()
  @IsOptional()
  @TransformToNumberArray()
  @IsArray()
  @IsNumber({}, { each: true })
  doctorIds?: number[];

  @ServiceClinicIdsSwagger()
  @IsOptional()
  @TransformToNumberArray()
  @IsArray()
  @IsNumber({}, { each: true })
  clinicIds?: number[];

  @ServiceSortBySwagger(scalarFields)
  @IsOptional()
  @IsString()
  @IsIn(scalarFields)
  sortBy?: string;

  @ServiceSortOrderSwagger()
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
