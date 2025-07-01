import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { RelationProperty } from '../../shared/utils/decorators/relation-property.decorator';
import {
  DoctorClinicsSwagger,
  DoctorEmailSwagger,
  DoctorFirstNameSwagger,
  DoctorLastNameSwagger,
  DoctorPhoneSwagger,
  DoctorServicesSwagger,
} from '../../swagger/methods/doctors/create-doctor-dto.swagger';
import { normalizePhone } from '../../shared/utils/phone/normalize-phone.util';

export class CreateDoctorDto {
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
  @Transform(({ value }) =>
    value ? normalizePhone(value as string) : (value as string),
  )
  phone?: string;

  @DoctorClinicsSwagger()
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @RelationProperty()
  clinics?: number[];

  @DoctorServicesSwagger()
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @RelationProperty()
  services?: number[];
}
