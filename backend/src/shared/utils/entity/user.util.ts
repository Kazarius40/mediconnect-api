import { User } from '../../../auth/entities/user.entity';
import { SafeUser } from '../../../auth/interfaces/safe-user.interface';

function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export function toSafeUser(user: User): SafeUser {
  return omit(user, [
    'password',
    'verificationToken',
    'verificationTokenExpires',
    'resetPasswordToken',
    'resetPasswordExpires',
    'tokens',
  ]);
}
