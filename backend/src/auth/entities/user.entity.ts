import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { UserRole } from '../../users/user-role.enum';
import { Token } from './token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: 'patient',
    nullable: true,
  })
  role: UserRole;

  @Column({ nullable: true, default: null })
  firstName?: string;

  @Column({ nullable: true, default: null })
  lastName?: string;

  @Column({ nullable: true, default: null })
  phone?: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  resetPasswordToken?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password.startsWith('$2b$')) return;
    this.password = await bcrypt.hash(this.password, 10);
  }

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
