import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  ServiceDescriptionSwagger,
  ServiceNameSwagger,
} from '../../swagger/methods/services/service-create-dto.swagger';

export class ServiceCreateDto {
  @ServiceNameSwagger()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ServiceDescriptionSwagger()
  @IsOptional()
  @IsString()
  description?: string | null;
}
