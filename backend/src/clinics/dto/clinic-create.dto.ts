import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
import { IsValidPhone } from '../../shared/validators/custom-validators';

export class ClinicCreateDto {
  @ClinicNameSwagger()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ClinicAddressSwagger()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ClinicPhoneSwagger()
  @IsNotEmpty()
  @TransformNormalizePhone()
  @IsValidPhone()
  phone: string;

  @ClinicEmailSwagger()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ClinicDoctorsSwagger()
  @IsOptional()
  @TransformToNumberArray()
  @IsArray()
  @IsNumber({}, { each: true })
  doctorIds?: number[];
}
