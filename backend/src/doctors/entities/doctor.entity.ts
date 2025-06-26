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
import { IBaseEntity } from '../../shared/utils/entity/base-entity';

@Entity()
export class Doctor implements IBaseEntity {
  // ------------------------------------------------------ Main fields ------------------------------------------------------------
  @PrimaryGeneratedColumn() id: number;
  @Column() firstName: string;
  @Column() lastName: string;
  @Column({ nullable: true, unique: true }) email?: string;
  @Column({ nullable: true, unique: true }) phone?: string;

  // ------------------------------------------------------ Timestamps ------------------------------------------------------------
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;

  // ------------------------------------------------------ Relations ------------------------------------------------------------
  @ManyToMany(() => Clinic, (clinic) => clinic.doctors) clinics: Clinic[];

  @ManyToMany(() => Service, (service) => service.doctors)
  @JoinTable()
  services: Service[];
}
