import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import {
  ServiceCreatedAtSwagger,
  ServiceDescriptionSwagger,
  ServiceIdSwagger,
  ServiceNameSwagger,
  ServiceUpdatedAtSwagger,
} from '../../swagger/methods/services/service-entity.swagger';

@Entity()
export class Service {
  // ------------------------------------------------------ Main fields ------------------------------------------------------------
  @ServiceIdSwagger()
  @PrimaryGeneratedColumn()
  id: number;

  @ServiceNameSwagger()
  @Column({ unique: true })
  name: string;

  @ServiceDescriptionSwagger()
  @Column({ type: 'text', nullable: true })
  description: string | null;

  // ------------------------------------------------------ Timestamps ------------------------------------------------------------
  @ServiceCreatedAtSwagger()
  @CreateDateColumn()
  createdAt: Date;

  @ServiceUpdatedAtSwagger()
  @UpdateDateColumn()
  updatedAt: Date;

  // ------------------------------------------------------ Relations ------------------------------------------------------------
  @ManyToMany(() => Doctor, (doctor) => doctor.services) doctors: Doctor[];
}
