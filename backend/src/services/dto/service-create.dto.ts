import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ServiceDescriptionSwagger,
  ServiceDoctorsSwagger,
  ServiceNameSwagger,
} from '../../swagger/methods/services/service-create-dto.swagger';
import { IsValidName } from '../../shared/validators/custom-validators';
import { TransformToNumberArray } from '../../shared/utils/decorators/transform-to-number-array.decorator';

export class ServiceCreateDto {
  @ServiceNameSwagger()
  @IsNotEmpty()
  @IsValidName()
  @IsString()
  name: string;

  @ServiceDescriptionSwagger()
  @IsOptional()
  @IsString()
  description?: string | null;

  @ServiceDoctorsSwagger()
  @IsOptional()
  @TransformToNumberArray()
  @IsArray()
  @IsNumber({}, { each: true })
  doctorIds?: number[];
}
