import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateClinicDto {
  @ApiProperty({ description: "Clinic's name", example: 'Healthy Paws Clinic' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Clinic's address",
    example: '123 Main St, Anytown',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: "Clinic's phone number",
    example: '+380671234567',
  })
  @IsPhoneNumber(undefined)
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Email клініки',
    example: 'info@clinic.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;
}
