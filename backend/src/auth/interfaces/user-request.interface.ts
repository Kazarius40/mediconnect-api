import { Request } from 'express';
import { UserRole } from '../../users/user-role.enum';
import { Token } from '../entities/token.entity';

export interface AuthenticatedUserPayload {
  id: number;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tokens?: Token[];
  jti: string;
}

export interface UserRequest extends Request {
  user: AuthenticatedUserPayload;
}
