import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class FilterServiceDto {
  @ApiPropertyOptional({ description: 'Фільтр за назвою послуги' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Поле для сортування',
    enum: ['name'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['name'])
  sortBy?: 'name';

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
