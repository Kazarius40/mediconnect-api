import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class FilterDoctorDto {
  @ApiPropertyOptional({ description: "Фільтр за ім'ям лікаря" })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Фільтр за прізвищем лікаря' })
  @IsOptional()
  @IsString()
  lastName?: string;

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
    enum: ['firstName', 'lastName', 'email', 'phone'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['firstName', 'lastName', 'email', 'phone'])
  sortBy?: 'firstName' | 'lastName' | 'email' | 'phone';

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
