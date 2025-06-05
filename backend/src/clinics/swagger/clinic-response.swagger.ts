import { ApiProperty } from '@nestjs/swagger';
import { DoctorResponse } from '../../doctors/swagger/doctor-response.swagger';

export class ClinicResponse {
  @ApiProperty({ description: 'Unique identifier of the clinic', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Name of the clinic',
    example: 'Central City Hospital',
  })
  name: string;

  @ApiProperty({
    description: 'Address of the clinic',
    example: '123 Main St, City, Country',
  })
  address: string;

  @ApiProperty({
    description: 'Phone number of the clinic',
    example: '+380441234567',
  })
  phone: string;

  @ApiProperty({
    description: 'Email of the clinic',
    example: 'info@clinic.com',
  })
  email: string;

  @ApiProperty({
    type: [DoctorResponse],
    description: 'Doctors working at this clinic',
    nullable: true,
  })
  doctors?: DoctorResponse[];

  @ApiProperty({
    description: 'Date and time when the clinic record was created',
    example: '2023-10-27T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the clinic record was last updated',
    example: '2023-10-27T10:30:00.000Z',
  })
  updatedAt: Date;
}

export class ClinicListResponse {
  @ApiProperty({ type: [ClinicResponse], description: 'List of clinics' })
  items: ClinicResponse[];
}
