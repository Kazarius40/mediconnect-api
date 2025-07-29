import api from '../axios';
import type {
  RefreshResponse,
  RegisterDto,
  RegisterResponse,
} from '@/interfaces/auth';
import { User } from '@/interfaces/user/user';

export const registerUser = (data: RegisterDto) =>
  api.post<RegisterResponse>('/auth/register', data);

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}

export function refreshToken() {
  return api.post<RefreshResponse>('/auth/refresh');
}

export function getProfile() {
  return api.get<User>('/auth/profile', { withCredentials: true });
}

export function verifyEmail(token: string) {
  return api.post<{ message: string }>('/auth/verify-email', { token });
}

export function resendVerification(email: string) {
  return api.post<{ message: string }>('/auth/resend-verification', { email });
}
