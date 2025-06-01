import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Clinic } from '../clinics/clinic.entity';
import { Service } from '../services/service.entity';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @ManyToMany(() => Clinic, (clinic) => clinic.doctors)
  clinics: Clinic[];

  @ManyToMany(() => Service, (service) => service.doctors)
  @JoinTable()
  services: Service[];
}
