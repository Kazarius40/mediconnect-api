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
  DoctorClinicsSwagger,
  DoctorEmailSwagger,
  DoctorFirstNameSwagger,
  DoctorLastNameSwagger,
  DoctorPhoneSwagger,
  DoctorServicesSwagger,
} from '../../swagger/methods/doctors/doctor-create-dto.swagger';
import { TransformNormalizePhone } from '../../shared/utils/phone/normalize-phone.util';
import { TransformToNumberArray } from '../../shared/utils/decorators/transform-to-number-array.decorator';

export class DoctorCreateDto {
  @DoctorFirstNameSwagger()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @DoctorLastNameSwagger()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @DoctorEmailSwagger()
  @IsOptional()
  @IsEmail()
  email?: string;

  @DoctorPhoneSwagger()
  @IsOptional()
  @IsPhoneNumber()
  @TransformNormalizePhone()
  phone?: string;

  @DoctorClinicsSwagger()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @TransformToNumberArray()
  clinics?: number[];

  @DoctorServicesSwagger()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @TransformToNumberArray()
  services?: number[];
}
