import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class FilterDoctorDto {
  @ApiPropertyOptional({ description: "Filter by doctor's first name" })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: "Filter by doctor's last name" })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: "Filter by doctor's email" })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: "Filter by doctor's phone number" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: ['firstName', 'lastName', 'email', 'phone'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['firstName', 'lastName', 'email', 'phone'])
  sortBy?: 'firstName' | 'lastName' | 'email' | 'phone';

  @ApiPropertyOptional({
    description: 'Sort order ("ASC" or "DESC")',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
