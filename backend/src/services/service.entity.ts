import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from '../doctors/doctor.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => Doctor, (doctor) => doctor.services)
  doctors: Doctor[];
}
