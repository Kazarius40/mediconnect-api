import api from '../axios';
import type { RegisterDto, RegisterResponse } from '@/interfaces/auth';

export const registerUser = (data: RegisterDto) =>
  api.post<RegisterResponse>('/auth/register', data);

export const resendVerification = (email: string) =>
  api.post<{ message: string }>('/auth/resend-verification', { email });

export const forgotPassword = (email: string) =>
  api.post<{ message: string }>('/auth/forgot-password', { email });

export const resetPassword = (token: string, password: string) =>
  api.post<{ message: string }>('/auth/reset-password', { token, password });

export const verifyEmail = (token: string) =>
  api.post<{ message: string }>('/auth/verify-email', { token });
