import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateClinicDto {
  @ApiProperty({ description: 'Назва клініки', example: 'Kyiv General Clinic' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Адреса клініки', example: 'вул. Хрещатик, 10' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Номер телефону клініки',
    example: '+380441234567',
  })
  @IsPhoneNumber(undefined)
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Email клініки',
    example: 'info@clinic.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Список ID лікарів, що працюють у клініці',
    type: [Number],
    example: [1, 2],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  doctorIds?: number[];
}
