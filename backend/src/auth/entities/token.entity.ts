import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import {
  TokenAccessTokenExpiresAtSwagger,
  TokenIdSwagger,
  TokenIsBlockedSwagger,
  TokenJtiSwagger,
  TokenRefreshTokenExpiresAtSwagger,
  TokenRefreshTokenSwagger,
} from '../../swagger/methods/users/token-entity.swagger';

@Entity()
export class Token {
  // ------------------------------------------------------ Primary key ---------------------------------------------------------
  @TokenIdSwagger()
  @PrimaryGeneratedColumn()
  id: number;

  // ------------------------------------------------------ Main fields ----------------------------------------------------------

  @Column()
  @TokenRefreshTokenSwagger()
  refreshToken: string;

  @Column()
  @TokenAccessTokenExpiresAtSwagger()
  accessTokenExpiresAt: Date;

  @Column()
  @TokenRefreshTokenExpiresAtSwagger()
  refreshTokenExpiresAt: Date;

  @Column({ default: false })
  @TokenIsBlockedSwagger()
  isBlocked: boolean;

  @Column()
  @TokenJtiSwagger()
  jti: string;

  // ------------------------------------------------------ Relations ------------------------------------------------------------
  @ManyToOne(() => User, (user) => user.tokens, {
    onDelete: 'CASCADE',
  })
  user: User;
}
