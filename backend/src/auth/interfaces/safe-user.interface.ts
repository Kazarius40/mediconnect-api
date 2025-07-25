import { UserRole } from '../../shared/enums/user-role.enum';

export interface SafeUser {
  id: number;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
