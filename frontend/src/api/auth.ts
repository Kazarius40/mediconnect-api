import api from './axios';
import type {
  LoginDto,
  LoginResponse,
  RefreshResponse,
  RegisterDto,
  RegisterResponse,
} from '@/interfaces/auth';
import { User } from '@/interfaces/user/user';

export function register(data: RegisterDto) {
  return api.post<RegisterResponse>('/auth/register', data);
}

export function login(data: LoginDto) {
  return api.post<LoginResponse>('/auth/login', data);
}

export function logout() {
  return api.post('/auth/logout');
}

export function refreshToken() {
  return api.post<RefreshResponse>(
    '/auth/refresh',
    {},
    { withCredentials: true },
  );
}

export function getProfile() {
  return api.get<User>('/auth/profile');
}

export function verifyEmail(token: string) {
  return api.post<{ message: string }>('/auth/verify-email', { token });
}

export function resendVerification(email: string) {
  return api.post<{ message: string }>('/auth/resend-verification', { email });
}
