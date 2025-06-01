import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Doctor } from '../doctors/doctor.entity';

@Entity()
export class Clinic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  address?: string;

  @ManyToMany(() => Doctor, (doctor) => doctor.clinics)
  @JoinTable()
  doctors: Doctor[];
}
