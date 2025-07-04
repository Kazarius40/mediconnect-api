import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import {
  ClinicAddressSwagger,
  ClinicCreatedAtSwagger,
  ClinicEmailSwagger,
  ClinicIdSwagger,
  ClinicNameSwagger,
  ClinicPhoneSwagger,
  ClinicUpdatedAtSwagger,
} from '../../swagger/methods/clinics/clinic-entity.swagger';

@Entity()
export class Clinic {
  // ------------------------------------------------------ Main fields ------------------------------------------------------------
  @ClinicIdSwagger()
  @PrimaryGeneratedColumn()
  id: number;

  @ClinicNameSwagger()
  @Column()
  name: string;

  @ClinicAddressSwagger()
  @Column()
  address: string;

  @ClinicPhoneSwagger()
  @Column({ unique: true })
  phone: string;

  @ClinicEmailSwagger()
  @Column({ nullable: true, unique: true })
  email?: string;

  // ------------------------------------------------------ Timestamps ------------------------------------------------------------
  @ClinicCreatedAtSwagger()
  @CreateDateColumn()
  createdAt: Date;

  @ClinicUpdatedAtSwagger()
  @UpdateDateColumn()
  updatedAt: Date;

  // ------------------------------------------------------ Relations ------------------------------------------------------------
  @ManyToMany(() => Doctor, (doctor) => doctor.clinics)
  @JoinTable()
  doctors: Doctor[];
}
