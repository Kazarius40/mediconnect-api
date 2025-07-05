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
import { UserRole } from '../../shared/enums/user-role.enum';
import { Token } from './token.entity';
import {
  UserCreatedAtSwagger,
  UserEmailSwagger,
  UserFirstNameSwagger,
  UserIdSwagger,
  UserLastNameSwagger,
  UserPasswordSwagger,
  UserPhoneSwagger,
  UserResetPasswordExpiresSwagger,
  UserResetPasswordTokenSwagger,
  UserRoleSwagger,
  UserTokensSwagger,
  UserUpdatedAtSwagger,
} from '../../swagger/methods/users/user-entity.swagger';

@Entity()
export class User {
  // ------------------------------------------------------ Primary key ---------------------------------------------------------
  @PrimaryGeneratedColumn()
  @UserIdSwagger()
  id: number;

  // ------------------------------------------------------ Main fields ----------------------------------------------------------
  @Column({ nullable: true })
  @UserFirstNameSwagger()
  firstName?: string;

  @Column({ nullable: true })
  @UserLastNameSwagger()
  lastName?: string;

  @Column({ nullable: true, unique: true })
  @UserPhoneSwagger()
  phone?: string;

  @Column({ unique: true })
  @UserEmailSwagger()
  email: string;

  @Column()
  @UserPasswordSwagger()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PATIENT })
  @UserRoleSwagger()
  role: UserRole;

  // ------------------------------------------------------ Password reset -------------------------------------------------------
  @Column({ nullable: true, type: 'varchar', length: 255 })
  @UserResetPasswordTokenSwagger()
  resetPasswordToken?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  @UserResetPasswordExpiresSwagger()
  resetPasswordExpires?: Date | null;

  // ------------------------------------------------------ Timestamps -----------------------------------------------------------
  @CreateDateColumn()
  @UserCreatedAtSwagger()
  createdAt: Date;

  @UpdateDateColumn()
  @UserUpdatedAtSwagger()
  updatedAt: Date;

  // ------------------------------------------------------ Relations ------------------------------------------------------------
  @OneToMany(() => Token, (token) => token.user)
  @UserTokensSwagger()
  tokens: Token[];

  // ------------------------------------------------------ Hooks ---------------------------------------------------------------
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  // ------------------------------------------------------ Methods -------------------------------------------------------------
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
