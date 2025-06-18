import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDoctorDto {
  @ApiProperty({ description: "Doctor's first name", example: 'Oleksandr' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: "Doctor's last name", example: 'Shevchenko' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    description: "Doctor's email address",
    example: 'oleksandr.shevchenko@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: "Doctor's phone number",
    example: '+380679876543',
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Array of clinic IDs the doctor is associated with',
    example: [1, 2],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  clinics?: number[];

  @ApiPropertyOptional({
    description: 'Array of service IDs the doctor provides',
    example: [10, 11],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  services?: number[];
}
