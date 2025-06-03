import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsNumber, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterClinicDto {
  @ApiPropertyOptional({ description: 'Фільтр за назвою клініки' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Фільтр за ID послуг (розділені комою, наприклад "1,2")',
    type: String,
    example: '1,2',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }): number[] =>
    typeof value === 'string' ? value.split(',').map(Number) : value,
  )
  @IsArray()
  @IsNumber({}, { each: true })
  serviceIds?: number[];

  @ApiPropertyOptional({
    description: 'Фільтр за ID лікарів (розділені комою, наприклад "1,2")',
    type: String,
    example: '1,2',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }): number[] =>
    typeof value === 'string' ? value.split(',').map(Number) : value,
  )
  @IsArray()
  @IsNumber({}, { each: true })
  doctorIds?: number[];

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
