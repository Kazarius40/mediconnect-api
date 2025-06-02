import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class FilterDoctorDto {
  @ApiPropertyOptional({ description: "Фільтр за ім'ям лікаря" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Фільтр за прізвищем лікаря' })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiPropertyOptional({ description: 'Фільтр за email лікаря' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Фільтр за телефоном лікаря' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Поле для сортування',
    enum: ['name', 'surname'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['name', 'surname'])
  sortBy?: 'name' | 'surname';

  @ApiPropertyOptional({
    description: 'Порядок сортування ("ASC" або "DESC")',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
