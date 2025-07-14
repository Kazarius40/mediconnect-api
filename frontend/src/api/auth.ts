import api from './axios';
import type { AuthUser } from '@/interfaces/auth';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export function login(data: LoginDto) {
  return api.post<AuthUser>('/auth/login', data);
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
