import { ApiProperty } from '@nestjs/swagger';

export class ServiceResponse {
  @ApiProperty({ description: 'Unique identifier of the service', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Unique name of the service',
    example: 'Dentistry',
  })
  name: string;

  @ApiProperty({
    description: 'Optional description of the service',
    example: 'Comprehensive dental care services.',
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'Date and time when the service was created',
    example: '2023-10-27T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the service was last updated',
    example: '2023-10-27T10:30:00.000Z',
  })
  updatedAt: Date;
}

export class ServiceListResponse {
  @ApiProperty({ type: [ServiceResponse], description: 'List of services' })
  items: ServiceResponse[];
}
