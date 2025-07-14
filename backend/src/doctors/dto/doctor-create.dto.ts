import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
import {
  IsValidName,
  IsValidPhone,
} from '../../shared/validators/custom-validators';

export class DoctorCreateDto {
  @DoctorFirstNameSwagger()
  @IsNotEmpty()
  @IsValidName()
  @IsString()
  firstName: string;

  @DoctorLastNameSwagger()
  @IsNotEmpty()
  @IsValidName()
  @IsString()
  lastName: string;

  @DoctorEmailSwagger()
  @IsOptional()
  @IsEmail()
  email?: string;

  @DoctorPhoneSwagger()
  @IsOptional()
  @TransformNormalizePhone()
  @IsValidPhone()
  phone?: string;

  @DoctorClinicsSwagger()
  @IsOptional()
  @TransformToNumberArray()
  @IsArray()
  @IsNumber({}, { each: true })
  clinicIds?: number[];

  @DoctorServicesSwagger()
  @IsOptional()
  @TransformToNumberArray()
  @IsArray()
  @IsNumber({}, { each: true })
  serviceIds?: number[];
}
