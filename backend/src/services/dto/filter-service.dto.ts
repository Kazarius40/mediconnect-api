import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class FilterServiceDto {
  @ApiPropertyOptional({ description: 'Filter by service name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Field for sorting',
    enum: ['name'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['name'])
  sortBy?: 'name';

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
