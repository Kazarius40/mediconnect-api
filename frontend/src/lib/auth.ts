import 'server-only';
import { User } from '@/interfaces/user/user';

// Залишаємо тільки типи, SSR-логіку переносимо в ssrAuth.ts
export interface SSRAuthResult {
  user: User | null;
  newAccessToken?: string | null;
}
