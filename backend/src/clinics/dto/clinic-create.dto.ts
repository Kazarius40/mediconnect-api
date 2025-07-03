import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import {
  ClinicAddressSwagger,
  ClinicDoctorsSwagger,
  ClinicEmailSwagger,
  ClinicNameSwagger,
  ClinicPhoneSwagger,
} from '../../swagger/methods/clinics/clinic-create-dto.swagger';
import { TransformToNumberArray } from '../../shared/utils/decorators/transform-to-number-array.decorator';
import { TransformNormalizePhone } from '../../shared/utils/phone/normalize-phone.util';

export class ClinicCreateDto {
  @ClinicNameSwagger()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ClinicAddressSwagger()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ClinicPhoneSwagger()
  @IsNotEmpty()
  @IsPhoneNumber()
  @TransformNormalizePhone()
  phone: string;

  @ClinicEmailSwagger()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ClinicDoctorsSwagger()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @TransformToNumberArray()
  doctors?: number[];
}
