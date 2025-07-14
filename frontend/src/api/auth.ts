import api from './axios';
import type {
  AuthUser,
  LoginDto,
  LoginResponse,
  RefreshResponse,
  RegisterDto,
  RegisterResponse,
} from '@/interfaces/auth';

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
  return api.post<RefreshResponse>('/auth/refresh');
}

export function getProfile() {
  return api.get<AuthUser>('/auth/profile');
}
