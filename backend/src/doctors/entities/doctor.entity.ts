import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { Service } from '../../services/entities/service.entity';
import {
  DoctorCreatedAtSwagger,
  DoctorEmailSwagger,
  DoctorFirstNameSwagger,
  DoctorIdSwagger,
  DoctorLastNameSwagger,
  DoctorPhoneSwagger,
  DoctorUpdatedAtSwagger,
} from '../../swagger/methods/doctors/doctor-entity.swagger';

@Entity()
export class Doctor {
  // ------------------------------------------------------ Main fields ------------------------------------------------------------
  @DoctorIdSwagger()
  @PrimaryGeneratedColumn()
  id: number;

  @DoctorFirstNameSwagger()
  @Column()
  firstName: string;

  @DoctorLastNameSwagger()
  @Column()
  lastName: string;

  @DoctorEmailSwagger()
  @Column({ nullable: true, unique: true })
  email?: string;

  @DoctorPhoneSwagger()
  @Column({ nullable: true, unique: true })
  phone?: string;

  // ------------------------------------------------------ Timestamps ------------------------------------------------------------
  @DoctorCreatedAtSwagger()
  @CreateDateColumn()
  createdAt: Date;

  @DoctorUpdatedAtSwagger()
  @UpdateDateColumn()
  updatedAt: Date;

  // ------------------------------------------------------ Relations ------------------------------------------------------------
  @ManyToMany(() => Clinic, (clinic) => clinic.doctors) clinics: Clinic[];

  @ManyToMany(() => Service, (service) => service.doctors)
  @JoinTable()
  services: Service[];
}
