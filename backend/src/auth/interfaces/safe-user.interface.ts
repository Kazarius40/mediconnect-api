import { UserRole } from '../../shared/enums/user-role.enum';

export interface SafeUser {
  id: number;
  email: string;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}
