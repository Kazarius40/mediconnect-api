import { IsIn, IsOptional, IsString } from 'class-validator';

export class FilterDoctorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsIn(['name', 'surname'])
  sortBy?: 'name' | 'surname';
}
