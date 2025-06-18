import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Service {
  // ------------------------------------------------------ Main fields ------------------------------------------------------------
  @ApiProperty({ description: 'Unique identifier of the service' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Unique name of the service' })
  @Column({ unique: true })
  name: string;

  @ApiPropertyOptional({ description: 'Optional description of the service' })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  // ------------------------------------------------------ Timestamps ------------------------------------------------------------
  @ApiProperty({ description: 'Date and time when the service was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the service was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // ------------------------------------------------------ Relations ------------------------------------------------------------
  @ManyToMany(() => Doctor, (doctor) => doctor.services) doctors: Doctor[];
}
