import { ApiProperty } from '@nestjs/swagger';
import { ServiceResponse } from '../../services/swagger/service-response.swagger';
import { ClinicResponse } from './clinic-response.swagger';

export class DoctorResponse {
  @ApiProperty({ description: 'Unique identifier of the doctor', example: 1 })
  id: number;

  @ApiProperty({ description: "Doctor's first name", example: 'John' })
  firstName: string;

  @ApiProperty({ description: "Doctor's last name", example: 'Doe' })
  lastName: string;

  @ApiProperty({
    description: "Doctor's email address",
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: "Doctor's phone number",
    example: '+380501234567',
  })
  phone: string;

  @ApiProperty({
    type: [ClinicResponse],
    description: 'Clinics associated with the doctor',
    nullable: true,
  })
  clinics?: ClinicResponse[];

  @ApiProperty({
    type: [ServiceResponse],
    description: 'Services provided by the doctor',
    nullable: true,
  })
  services?: ServiceResponse[];

  @ApiProperty({
    description: 'Date and time when the doctor record was created',
    example: '2023-10-27T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the doctor record was last updated',
    example: '2023-10-27T10:30:00.000Z',
  })
  updatedAt: Date;
}

export class DoctorListResponse {
  @ApiProperty({ type: [DoctorResponse], description: 'List of doctors' })
  items: DoctorResponse[];
}
